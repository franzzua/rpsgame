import style from "./game.module.css";

export const GameFinished = () => {
    return <div className={style.container}>
        Game is finished.
        <a href="..">Play again</a>
    </div>
}