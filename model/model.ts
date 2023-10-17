export enum Move {
     Null, Rock, Paper, Scissors, Spock, Lizard
}

export type GameId = string;

export type Game = {
    id: GameId;
    /**
     * Your move
     */
    move: Move | undefined;
    /**
     * Address of second player
     */
    j2: string | undefined;
    /**
     * Amount in ETH
     */
    stake: bigint | undefined;

    salt: string | undefined;
}

export enum GameResult {
    Pending,
    Win,
    Loose
}