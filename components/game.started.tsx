import {useEffect, useState} from "react";
import Web3 from "web3";
import {useCell} from "../helpers/use-cell";
import style from "./game.module.css";
import {gameStore} from "../services/game.store";

export const GameStarted = () => {

    const info = useCell(() => gameStore.info.get());
    const [timeLeft, setTimeLeft] = useState(gameStore.timeLeftInSeconds);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(gameStore.timeLeftInSeconds);
        }, 1000);
        return () => clearInterval(intervalId)
    }, []);
    if (!info) return <></>;
    return <div className={style.container}>
        Game
        <div>You stake {Web3.utils.fromWei(info.stake, 'ether')} ETH on with {info.j2}</div>
        {timeLeft > 0 && <div>Wait patiently {timeLeft} seconds...</div>}
        <button onClick={gameStore.checkResult}>Check result</button>
    </div>
}
