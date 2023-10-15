import {useCell} from "../helpers/use-cell";
import {GameCreated} from "./game.created";
import {GameJoined} from "./game.joined";
import {GameFinished} from "./gameFinished";
import {GameStarted} from "./game.started";
import {gameStore} from "../services/game.store";

export const GameApp = () => {
    const state = useCell(() => gameStore.state);
    switch (state) {
        case 'initial':
            return <>
                <button onClick={gameStore.create}>Create Game</button>
                <button onClick={gameStore.join}>Join Game</button>
            </>;
        case 'created':
            return <GameCreated/>;
        case 'starting':
            return `Game is starting...`;
        case 'joined':
            return <GameJoined/>;
        case 'started':
            return <GameStarted/>;
        case 'finished':
            return <GameFinished/>;
    }
}