import "./ioc";
import {createRoot} from 'react-dom/client';
import {GameApp} from "./components/game.app";

createRoot(document.body).render(<>
    <GameApp/>
</>);
