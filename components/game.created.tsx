import {JSX} from "react";
import {formatEther, parseEther} from "ethers";
import {useCell} from "../helpers/use-cell";
import {Move} from "../model/model";
import {Button} from "./button";
import style from "./game.module.css";
import {gameStore} from "../services/game.store";

export const GameCreated = () => {
    const game = useCell(() => gameStore.gameCreate);
    return <div className={style.container}>
        Game {game.id}
        <SelectMove value={game.move} onChange={e => gameStore.patch({move: +e.currentTarget.value})}/>
        <input placeholder="Select address" value={game.j2} type='search'
               onChange={e => gameStore.patch({j2: e.currentTarget.value})}/>
        <input type="number" step="0.0001" placeholder="Stake amount in ETH"
               onChange={e => gameStore.patch({stake: parseEther(e.currentTarget.value)})}/>
        <StartGameButton/>
    </div>
}

const StartGameButton = () => {
    const isValid = useCell(() => gameStore.isValid);
    return <Button onClick={gameStore.start} disabled={!isValid}>Start Game</Button>
}

export const SelectMove = (props: JSX.IntrinsicElements["select"]) => <select {...props}>
    <option value={null}>Select Move</option>
    <option value={Move.Rock}>Rock</option>
    <option value={Move.Paper}>Paper</option>
    <option value={Move.Scissors}>Scissors</option>
    <option value={Move.Spock}>Spock</option>
    <option value={Move.Lizard}>Lizard</option>
</select>