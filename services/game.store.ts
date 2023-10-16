import {AsyncCell, bind, cell, Fn} from "@cmmn/cell/lib";
import hex from "hex-encoding";
import {accountService} from "./account.service";
import {Game, GameResult, Move} from "../model/model";
import {routeService} from "./route.service";
import {Web3Api} from "./web3.api";

class GameStore {

    @cell
    private get account(){
        return accountService.Account;
    }

    @cell
    public get gameAddress(){
        return routeService.path[0];
    }

    public api = new AsyncCell<Web3Api | undefined>(() => {
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
            localStorage.setItem('game', JSON.stringify({salt: this.gameCreate.salt, move: this.gameCreate.move}))
            routeService.goTo([await api.getAddress()])
        }catch (e){
            this.state = 'created';
            console.error(e);
            if (Notification.permission !== "granted")
                await Notification.requestPermission();
            new Notification(`Starting game failed`,{
                body: e.message,
                vibrate: 10
            });
        }
    }

    public async makeMove(move: Move){
        const info = this.info.get();
        if (!info) return;
        if (this.player != 'j2') return;
        const api = this.api.get();
        // await api.checkJ1Timeout();
        await api.makeMove(move, info.stake);
    }

    @bind
    public async checkResult(){
        const info = this.info.get();
        const api = this.api.get();
        if (!info) return;
        // if (+info.lastAction + 300000 < +new Date()) {
        //     try {
        //         switch (this.player) {
        //             case "j1":
        //                 await api.checkJ2Timeout();
        //                 break;
        //             case "j2":
        //                 await api.checkJ1Timeout();
        //                 break;
        //         }
        //         this.state = 'finished';
        //     }catch (e){
        //
        //     }
        // }
        const game = JSON.parse(localStorage.getItem('game')) as Game;
        await api.solve(game.move, game.salt);
    }

}

export const gameStore = new GameStore();