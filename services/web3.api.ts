import {Game, GameId, Move} from "../model/model";
import {accountService} from "./account.service";
import {deployRPS, getRPS, RPS} from "./contracts";

export class Web3Api{
    private constructor(private rps: RPS) {
    }

    public getAddress(){
        return this.rps.getAddress()
    }

    public static async Start(game: Game) {
        const rps = await deployRPS(game);
        return new Web3Api(rps);
    }
    public static async Open(rpsAddress: string) {
        const rps = await getRPS(rpsAddress);
        return new Web3Api(rps);
    }

    async joinGame(game: Game): Promise<void> {

    }

    async getInfo(){
        const j1 = await this.rps.j1() as string;
        const j2 = await this.rps.j2() as string;
        const lastAction = new Date(1000*Number(await this.rps.lastAction()));
        const stake = await this.rps.stake() as bigint;
        return {j1, j2, lastAction, stake};
    }

    async solve(move: Move, salt: string){
        await this.rps.solve(move, salt);
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
        await this.rps.play(+move, {
            value: stake,
        });
    }

    selectPlayer(gameId: GameId, address: string): void {
    }

    stake(gameId: GameId, amount: string): void {
    }
}