import {cell, Fn, ObservableList} from "@cmmn/cell/lib";
import {Adapter} from "../services/adapter";
import {Web3Adapter} from "../services/web3.adapter";

export class GameStore {
    private constructor(private adapter: Adapter, private id: string) {
    }

    @Fn.cache()
    public static getOrCreate(id: string){
        return new GameStore(new Web3Adapter(), id);
    }

    @cell
    public Games = new ObservableList();


}