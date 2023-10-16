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
    if (info.stake == '0') return <>Game is finished</>;
    return <div className={style.container}>
        Game
        <div>You going to join game with {formatEther(info.stake)} ETH with {info.j1}</div>
        {timeLeft > 0 && <div>Left {timeLeft} seconds...</div>}
        <SelectMove value={selected} onChange={e => setSelected(+e.currentTarget.value)}/>
        <button disabled={selected === Move.Null}
            onClick={() => gameStore.makeMove(selected)}>Pay & play!</button>
    </div>
}
