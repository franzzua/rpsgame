import {Game, Move} from "../model/model";
import {RPS} from "@contracts/RPS";

export class Web3Api{
    public constructor(private rps: RPS) {
    }

    public getAddress(){
        return this.rps.getAddress()
    }

    public static Start: (game: Game) => Promise<Web3Api>;
    public static Open: (rpsAddress: string) => Promise<Web3Api>;

    async joinGame(game: Game): Promise<void> {

    }

    async getInfo(){
        const j1 = await this.rps.j1() as string;
        const j2 = await this.rps.j2() as string;
        const c2 = await this.rps.c2();
        const lastAction = new Date(1000*Number(await this.rps.lastAction()));
        const stake = await this.rps.stake() as bigint;
        return {j1, j2, c2, lastAction, stake};
    }

    async solve(move: Move, salt: string){
        await this.rps.solve(move, salt).then(x => x?.wait(1));
    }

    async checkJ2Timeout() {
        await this.rps.j2Timeout();
    }

    async checkJ1Timeout() {
        await this.rps.j1Timeout();
    }

    async makeMove(move: Move, stake: bigint) {
        await this.rps.play(+move, {
            value: stake,
        }).then(x => x?.wait(1));
    }

    async haveSecondMoved(){
        const c2 = await this.rps.c2();
        return !!c2;
    }

}