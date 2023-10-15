import {Game, GameId, GameResult, Move} from "../../model/model";
import {Api} from "../api";
import {getRPS, RPS, StartedGameInfo} from "./contracts";

export class Web3Api extends Api {
    private rps: StartedGameInfo['rps'];
    private start: Date = new Date();
    private salt: string;

    private constructor(game: Game, result: StartedGameInfo, role: Api['role']) {
        super();
        this.role = role;
        this.game = game;
        this.rps = result.rps;
        this.address = result.address;
        this.salt = result.saltHex;
    }

    public static async Start(game: Game): Promise<Api> {
        const result = await getRPS(game.move, game.address);
        return new Web3Api(game, result, 'j1');
    }
    public static async Open(rpsAddress: string, account: string): Promise<Api> {
        const rps = RPS(rpsAddress);
        const j1 = await rps.methods.j1().call() as string;
        const j2 = await rps.methods.j2().call() as string;
        const lastAction = await rps.methods.lastAction().call() as string;
        const stake = await rps.methods.stake().call() as string;
        console.log(j1, j2, account, lastAction, stake);
        return new Web3Api({
            move: Move.Null,
            address: undefined,
            stake,
            id: undefined
        }, {
            rps, address: rpsAddress, saltHex: undefined
        }, j1.toLowerCase() === account.toLowerCase() ? 'j1' :
            j2.toLowerCase() === account.toLowerCase() ? 'j2' : undefined);
    }
    async joinGame(game: Game): Promise<void> {

    }

    async checkResult(){
        if (+this.start + 5 * 1000 < +new Date()){
            const result = await this.rps.methods.j2Timeout().call();
            console.log(result);
            return GameResult.Win;
        }
        try {
            await this.rps.methods.solve(this.game.move, this.salt).call();
        }catch (e) {
            return GameResult.Pending;
        }
    }

    makeMove(gameId: GameId, move: Move): void {
    }

    selectPlayer(gameId: GameId, address: string): void {
    }

    stake(gameId: GameId, amount: string): void {
    }
}