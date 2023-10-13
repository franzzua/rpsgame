import {GameId, Move} from "./model";

export abstract class Adapter {
    abstract createGame(): GameId;

    abstract vote(gameId: GameId, move: Move): void;
}