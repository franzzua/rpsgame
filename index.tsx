import {createRoot} from 'react-dom/client';
import {GameApp} from "./components/game.app";
import {deployRPS, getRPS} from "./services/contracts";
import {Web3Api} from "./services/web3.api";

Web3Api.Open = async rpsAddress => new Web3Api(await getRPS(rpsAddress));
Web3Api.Start = async rpsAddress => new Web3Api(await deployRPS(rpsAddress));

createRoot(document.body).render(<>
    <GameApp/>
</>);
