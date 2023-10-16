import Web3 from "web3";
import {Game, GameId, Move} from "../model/model";
import {accountService} from "./account.service";
import {deployRPS, RPS, StartedGameInfo} from "./contracts";

export class Web3Api{
    private constructor(public rps: StartedGameInfo['rps']) {
    }

    public static async Start(game: Game) {
        const rps = await deployRPS(game);
        return new Web3Api(rps);
    }
    public static async Open(rpsAddress: string) {
        const rps = RPS(rpsAddress);
        return new Web3Api(rps);
    }

    async joinGame(game: Game): Promise<void> {

    }

    async getInfo(){
        const j1 = await this.rps.methods.j1().call() as string;
        const j2 = await this.rps.methods.j2().call() as string;
        const lastAction = new Date(1000*Number(await this.rps.methods.lastAction().call()));
        const stake = await this.rps.methods.stake().call() as bigint;
        return {j1, j2, lastAction, stake};
    }

    async solve(move: Move, salt: string){
        const gas = await this.rps.methods.solve(move, salt).estimateGas();
        await this.rps.methods.solve(move, salt).send({
            from: accountService.Account,
            gas: gas*5n
        });
    }

    async checkJ2Timeout() {
        const gas = await this.rps.methods.j2Timeout().estimateGas();
        await this.rps.methods.j2Timeout().send({
            from: accountService.Account,
            gas: gas.toString()
        });
    }

    async checkJ1Timeout() {
        await this.rps.methods.j1Timeout().send({
            from: accountService.Account
        });
    }

    async makeMove(move: Move, stake: bigint) {
        const gas = await this.rps.methods.play(+move).estimateGas({
            value: stake,
        });
        console.log(gas, gas*5n);
        await this.rps.methods.play(+move).send({
            from: accountService.Account.toLowerCase(),
            value: stake,
            gasPrice: Web3.utils.toWei(20, 'gwei'),
            gas: gas*5n
        });
    }

    selectPlayer(gameId: GameId, address: string): void {
    }

    stake(gameId: GameId, amount: string): void {
    }
}