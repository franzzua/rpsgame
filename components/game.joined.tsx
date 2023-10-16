import {useEffect, useState} from "react";
import {formatEther, parseEther} from "ethers";
import {useCell} from "../helpers/use-cell";
import {Move} from "../model/model";
import {gameStore} from "../services/game.store";
import {SelectMove} from "./game.created";
import style from "./game.module.css";

export const GameJoined = () => {

    const info = useCell(() => gameStore.info.get());
    const [timeLeft, setTimeLeft] = useState(gameStore.timeLeftInSeconds);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(gameStore.timeLeftInSeconds);
        }, 1000);
        return () => clearInterval(intervalId)
    }, []);
    const [selected, setSelected] = useState(Move.Null);
    if (info.stake == 0n) return <>Game is finished</>;

    return <div className={style.container}>
        Game
        <div>You going to join game with {formatEther(info.stake)} ETH with {info.j1}</div>
        {info.c2 ? <>
            <div>Wait first player for {timeLeft} seconds...</div>
            <button disabled={timeLeft > 0}
                    onClick={() => gameStore.checkResult()}>Win by timeout</button>
        </> : <>
            {timeLeft > 0 && <div>Left {timeLeft} seconds...</div>}
            <SelectMove value={selected} onChange={e => setSelected(+e.currentTarget.value)}/>
            <button disabled={selected === Move.Null}
                onClick={() => gameStore.makeMove(selected)}>Pay & play!</button>
        </>}
    </div>
}
