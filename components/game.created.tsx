import {useCell} from "../helpers/use-cell";
import {Move} from "../model/model";
import style from "./game.module.css";
import {gameStore} from "../services/game.store";

export const GameCreated = () => {
    const game = useCell(() => gameStore.game);
    return <div className={style.container}>
        Game {game.id}
        <select value={game.move} onChange={e => gameStore.patch({move: +e.currentTarget.value})}>
            <option value={null}>Select Move</option>
            <option value={Move.Rock}>Rock</option>
            <option value={Move.Paper}>Paper</option>
            <option value={Move.Scissors}>Scissors</option>
            <option value={Move.Spock}>Spock</option>
            <option value={Move.Lizard}>Lizard</option>
        </select>

        <input placeholder="Select address" value={game.address} type='search'
               onChange={e => gameStore.patch({address: e.currentTarget.value})}/>
        <input placeholder="Stake amount" value={game.stake} onChange={e => gameStore.patch({stake: e.currentTarget.value})}/>
        <StartGameButton/>
    </div>
}

const StartGameButton = () => {
    const isValid = useCell(() => gameStore.isValid);
    return <button onClick={gameStore.start} disabled={!isValid}>Start Game</button>
}