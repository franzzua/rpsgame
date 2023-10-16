import Web3, {Contract} from 'web3';
import hasher from '@contracts/Hasher.json' ;
import rps from '@contracts/RPS.sol/RPS.json' ;
import {Game, Move} from "../model/model";
import '@metamask/detect-provider';
import {accountService} from "./account.service";

const web3 = new Web3(window.ethereum);
export const Hasher = new web3.eth.Contract<typeof hasher.abi>(hasher.abi, hasher.address);
export const RPS = (address: string) => new web3.eth.Contract<typeof rps.abi>(rps.abi, address);

export async function deployRPS(game: Game){
    const hash = await Hasher.methods.hash(game.move, game.salt).call();
    const rpsContract = await new web3.eth.Contract<typeof rps.abi>(rps.abi).deploy({
        data: rps.bytecode,
        arguments: [hash, game.j2]
    }).send({
        from: accountService.Account,
        value: game.stake
    });
    return rpsContract;
}

export type StartedGameInfo = {
    rps: Contract<typeof rps.abi>;
    address: string;
    saltHex: string;
}
