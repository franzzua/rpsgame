import {useCell} from "../helpers/use-cell";
import {gameStore} from "../services/game.store";
import style from "./game.module.css";

export const GameFinished = () => {
    const result = useCell(() => gameStore.result.get());
    return <div className={style.container}>
        Game is finished. {result}
        <a href="..">Play again</a>
    </div>
}