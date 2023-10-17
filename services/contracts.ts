import hasherJSON from '@contracts/Hasher.json' ;
import rpsJSON from '@contracts/RPS.sol/RPS.json' ;
import {Game, Move} from "../model/model";
import '@metamask/detect-provider';
import {BrowserProvider, Contract, ContractFactory} from "ethers";
import type {Hasher} from "@contracts/Hasher"
import type {RPS} from "@contracts/RPS"
export type {RPS} from "@contracts/RPS"

const web3 = new BrowserProvider(window.ethereum);
export const hasher = new Contract(hasherJSON.address, hasherJSON.abi, web3) as Hasher;
export const getRPS = async (address: string) => new Contract(address, rpsJSON.abi, await web3.getSigner()) as RPS;

export async function deployRPS(game: Game){
    const hash = await hasher.hash(game.move, game.salt);
    console.log(hash);
    const factory = new ContractFactory(rpsJSON.abi, rpsJSON.bytecode, await web3.getSigner());
    const rpsContract = await factory.deploy(hash, game.j2, {
        value: game.stake
    }) as RPS;
    await rpsContract.waitForDeployment();
    return rpsContract;
}
