import {AsyncCell, bind, cell, Fn} from "@cmmn/cell/lib";
import {accountService} from "./account.service";
import {Api} from "./api";
import {Game, GameResult, Move} from "../model/model";
import {routeService} from "./route.service";

class GameStore {

    @cell
    private get account(){
        return accountService.Account;
    }

    @cell
    public get gameAddress(){
        return routeService.path[0];
    }

    public api = new AsyncCell<Api | undefined>(() => {
        if (!this.gameAddress) return undefined;
        if (!this.account) return undefined;
        return Api.Open(this.gameAddress, this.account);
    });

    @cell
    public startTime: Date | undefined;

    @cell
    public result: GameResult | undefined;

    @cell
    public game : Game | undefined = undefined;

    @cell
    public get state(): 'initial'|'created'|'starting'|'started'|'joined'|'finished' {
        const api = this.api.get();
        if (!api) {
            return 'initial';
        }
        if (api.role === 'j1')
            return 'started';
        if (api.role === 'j2')
            return 'joined';
        // someone else watches?
        return 'initial';
    }
    public set state(val){}

    public patch(diff: Partial<Game>){
        this.game = {
            ...this.game,
            ...diff
        };
    }

    @cell
    public get isValid(){
        return !!this.game.stake && !!this.game.move && !!this.game.address;
    }

    @bind
    public create() {
        this.game ={
            id: Fn.ulid(),
            stake: '1',
            move: Move.Lizard,
            address: accountService.Account
        };
        this.state = 'created';
    }
    @bind
    public async start() {
        if (!this.isValid) return;
        this.state = 'starting';
        try {
            const api = await Api.Start(this.game);
            this.state = 'started';
            this.startTime = new Date();
            this.result = GameResult.Pending;
            routeService.goTo([api.address])
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

    @bind
    public async checkResult(){
        if (!this.adapter) return;
        const result = await this.adapter.checkResult();
        if (result == this.result)
            return;
        this.state = 'finished';
        this.result = result;
    }

    public async join(){
        const rps = await Api.Open();
        console.log(rps);
    }
}

export const gameStore = new GameStore();