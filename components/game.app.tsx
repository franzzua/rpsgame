import {useCell} from "../helpers/use-cell";
import {Button} from "./button";
import {GameCreated} from "./game.created";
import {GameJoined} from "./game.joined";
import {GameFinished} from "./gameFinished";
import {GameStarted} from "./game.started";
import {gameStore} from "../services/game.store";

export const GameApp = () => {
    const state = useCell(() => gameStore.state);
    const player = useCell(() => gameStore.player);
    switch (state) {
        case 'initial':
            return <>
                <Button onClick={gameStore.create}>Create Game</Button>
            </>;
        case 'created':
            return <GameCreated/>;
        case 'loading':
            return `Game is loading...`;
        case 'started':
            switch (player){
                case "j1": return <GameStarted/>;
                case "j2": return <GameJoined/>;
                case "unknown": return <>Please login as one of players</>;
            }
        case 'finished':
            return <GameFinished/>;
    }
}