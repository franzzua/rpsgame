import {AsyncCell, bind, cell, Fn} from "@cmmn/cell/lib";
import {formatEther, parseEther} from "ethers";
import hex from "hex-encoding";
import {accountService} from "./account.service";
import {Game, Move} from "../model/model";
import {getBalance} from "./contracts";
import {routeService} from "./route.service";
import {Web3Api} from "./web3.api";

class GameStore {

    @cell
    private get account(){
        return accountService.Account;
    }

    public TIMEOUT = 300;

    @cell
    public get gameAddress(){
        return routeService.path[0];
    }

    public api = new AsyncCell<Web3Api | undefined>(() => {
        if (!this.account) return undefined;
        if (!this.gameAddress) return undefined;
        return Web3Api.Open(this.gameAddress);
    });

    public info = new AsyncCell(() => {
        const api = this.api.get();
        if (!api) return undefined;
        return api.getInfo();
    })

    public get timeLeftInSeconds(){
        return Math.floor(5*60 - (+new Date() - +this.info.get().lastAction)/1000);
    }

    @cell
    public gameCreate : Game | undefined = undefined;

    @cell
    public get state(): 'initial'|'created'|'loading'|'started'|'finished' {
        if (!this.gameAddress) {
            return 'initial';
        }
        const info = this.info.get();
        if (this.gameAddress && !info)
            return 'loading';
        if (info.stake === 0n)
            return 'finished';
        return 'started';
    }

    @cell
    public get player(): 'j1'|'j2'|'unknown'{
        const info = this.info.get();
        if (!info) return 'unknown';
        if (info.j1.toLowerCase() === this.account.toLowerCase())
            return 'j1';
        if (info.j2.toLowerCase() === this.account.toLowerCase())
            return 'j2';
        return 'unknown';
    }
    public set state(val){}

    public patch(diff: Partial<Game>){
        this.gameCreate = {
            ...this.gameCreate,
            ...diff
        };
    }

    @cell
    public get isValid(){
        return !!this.gameCreate.stake && !!this.gameCreate.move && !!this.gameCreate.j2;
    }

    @bind
    public create() {
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const saltHex = '0x'+hex.encode(salt);
        this.gameCreate ={
            id: Fn.ulid(),
            stake: undefined,
            move: undefined,
            j2: undefined,
            salt: saltHex
        };
        this.state = 'created';
    }
    @bind
    public async start() {
        if (!this.isValid) return;
        this.state = 'loading';
        try {
            const api = await Web3Api.Start(this.gameCreate);
            await this.persistGame(this.gameCreate);
            routeService.goTo([await api.getAddress()])
        }catch (e){
            this.state = 'created';
            console.error(e);
            await this.showError(`Create game failed`, e);
        }
    }

    public async makeMove(move: Move){
        const info = this.info.get();
        if (!info) return;
        if (this.player != 'j2') return;
        const api = this.api.get();
        try {
            await api.makeMove(move, info.stake);
            this.info.set(await api.getInfo());
            // refresh info and lastAction time
        }catch (e){
            await this.showError(`Transaction failed. Please try again`)
        }
        await this.persistGame({
            move, salt: "", stake: info.stake
        })
    }

    @bind
    public async checkResult(){
        const api = this.api.get();
        const info = await api.getInfo();
        if (!info) return;
        this.info.set(info);
        if (+info.lastAction + this.TIMEOUT * 1000 < +new Date()) {
            try {
                switch (this.player) {
                    case "j1":
                        await api.checkJ2Timeout();
                        break;
                    case "j2":
                        await api.checkJ1Timeout();
                        break;
                }
                this.state = 'finished';
            } catch (e) {
                await this.showError(`Wait another player action patiently, please.`)
            }
            return;
        }
        if (this.player !== "j1")
            throw new Error(`Only first player is able to solve game`);
        if (!(await api.haveSecondMoved())) {
            await this.showError(`Second player have not moved yet. Wait patiently, please.`)
            return;
        }
        try {
            const game = await this.readPersistedGame();
            if (!game)
                return;
            await api.solve(game.move, game.salt);
            this.state = 'finished';
        }catch (e){
            await this.showError(`Transaction failed. Please try again`)
        }
    }

    private async showError(message: string, error?: Error){
        if (!globalThis.Notification)
            throw error ?? new Error(message);
        if (globalThis.Notification.permission !== "granted")
            await Notification.requestPermission();
        new globalThis.Notification(message,{
            vibrate: 10
        });
    }

    private async persistGame(game: Pick<Game, "salt"|"move"|"stake">){
        const balance = await getBalance(this.account)
        localStorage[this.account] = JSON.stringify({
            salt: game.salt,
            move: game.move,
            stake: formatEther(game.stake),
            balance: formatEther(balance)
        });
    }
    private async readPersistedGame(){
        try {
            return JSON.parse(localStorage[this.account]) as Pick<Game, "salt"|"move"> & {
                stake: string;
                balance: string
            };
        } catch (e) {
            await this.showError(`Persisted game is lost or corrupted. `)
        }
    }

    public result = new AsyncCell(async () => {
        const persisted = await this.readPersistedGame();
        const balance = await getBalance(this.account);
        const oldBalance = parseEther(persisted.balance);
        const stake = parseEther(persisted.stake)
        if (Math.abs(Number(oldBalance - balance)) < stake/10n){
            return 'You lose';
        }
        if (Math.abs(Number(oldBalance + stake - balance)) < stake/10n){
            return 'Draw';
        }
        if (Math.abs(Number(oldBalance + 2n*stake - balance)) < stake/10n){
            return 'You win';
        }
        return `Check your balance to know who is winner`
    })

}

export const gameStore = new GameStore();