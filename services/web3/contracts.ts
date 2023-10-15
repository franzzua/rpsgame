import hex from "hex-encoding";
import Web3, {Contract} from 'web3';
import factory from '@contracts/RPSFactory.json' ;
import hasher from '@contracts/Hasher.json' ;
import rps from '@contracts/RPS.sol/RPS.json' ;
import {Move} from "../../model/model";
import '@metamask/detect-provider';
import {accountService} from "../account.service";

const web3 = new Web3(window.ethereum);
export const Factory = new web3.eth.Contract(factory.abi, factory.address);
export const Hasher = new web3.eth.Contract<typeof hasher.abi>(hasher.abi, hasher.address);
export const RPS = (address: string) => new web3.eth.Contract<typeof rps.abi>(rps.abi, address);

export async function getRPS(move: Move, address: string){
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const saltHex = '0x'+hex.encode(salt);
    console.log(saltHex)
    const hash = await Hasher.methods.hash(move, saltHex).call();
    console.log(hash)
    const rpsContract = await new web3.eth.Contract<typeof rps.abi>(rps.abi).deploy({
        data: rps.bytecode,
        arguments: [saltHex, address]
    }).send({
        from: accountService.Account
    });
    return {rps: rpsContract, address: rpsContract.options.address, saltHex};
}

export type StartedGameInfo = {
    rps: Contract<typeof rps.abi>;
    address: string;
    saltHex: string;
}
