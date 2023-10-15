import {useEffect, useState} from "react";
import {useCell} from "../helpers/use-cell";
import {Move} from "../model/model";
import style from "./game.module.css";
import {gameStore} from "../services/game.store";

export const GameStarted = () => {

    const game = useCell(() => gameStore.api.get()?.game);
    const start = useCell(() => gameStore.startTime);
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId)
    }, []);
    const timeLeft = 5*60 - (+time - +start)/1000;
    if (!game) return <></>;
    return <div className={style.container}>
        Game {game.id}
        <div>You stake {game.stake} ETH on {Move[game.move]} with {game.address}</div>
        {timeLeft > 0 && <div>Wait patiently {timeLeft} seconds...</div>}
        <button onClick={gameStore.checkResult}>Check result</button>
    </div>
}
