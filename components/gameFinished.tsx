import {useCell} from "../helpers/use-cell";
import {GameResult} from "../model/model";
import style from "./game.module.css";
import {gameStore} from "../services/game.store";

export const GameFinished = () => {
    const result = useCell(() => gameStore.result);
    return <div className={style.container}>
        {GameResult[result]}
    </div>
}