import {Game, GameId, GameResult, Move} from "../model/model";

export abstract class Api {

    public static Start: (game: Game) => Promise<Api>;
    public static Open: (address: string, account: string) => Promise<Api>;

    public address: string;
    public game: Game;
    public role: 'j1'|'j2';

    abstract checkResult(): Promise<GameResult>;
}