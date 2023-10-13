import {createRoot} from 'react-dom/client';
import {Game} from "./game/game";

createRoot(document.body).render(<App/>);

function App(){
    return <>
        <Game/>
    </>;
}