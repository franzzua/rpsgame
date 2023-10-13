import {Adapter} from "./adapter";
import {GameId, Move} from "./model";

export class Web3Adapter implements Adapter{
    createGame(): GameId {
        return undefined;
    }

    vote(gameId: GameId, move: Move): void {
    }

}