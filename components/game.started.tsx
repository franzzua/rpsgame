import {formatEther, parseEther} from "ethers";
import {useEffect, useState} from "react";
import {useCell} from "../helpers/use-cell";
import {Button} from "./button";
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
        <div>You stake {formatEther(info.stake)} ETH on with {info.j2}</div>
        <div>Send url of this page to second player.</div>
        {timeLeft > 0 && <div>Wait patiently {timeLeft} seconds...</div>}
        <Button onClick={gameStore.checkResult}>Check result</Button>
    </div>
}
