import * as assert from "node:assert";
import {beforeEach,before, test} from "node:test";
import {gameStore, Move, Web3Api} from "../dist/lib.js";
import {Cell, Fn} from "@cmmn/cell/lib";
import {RPSMock} from "./RPSMock.js";

const account = new Cell('j1');
let rpsMock;
before(() => {
    Web3Api.Start = async (game) => {
        return new Web3Api(rpsMock = new RPSMock(game));
    }
    Web3Api.Open = async (address) => {
        return new Web3Api(rpsMock);
    }
    Object.defineProperty(gameStore, 'account', {
        get() {
            return account.get();
        }
    })
    Cell.OnChange(() => [
        gameStore.info.get(),
        gameStore.api.get(),
        gameStore.state,
        gameStore.gameAddress
    ], Fn.I);
});
beforeEach(() => {
    gameStore.gameAddress = undefined;
})

async function simpleGame(move1, move2){
    gameStore.create();
    gameStore.patch({
        move: move1,
        stake: '1',
        j2: 'j2',
    })
    await gameStore.start();
    gameStore.gameAddress = 'game';
    account.set('j2');
    while (!gameStore.info.get())
        await Promise.resolve();
    await gameStore.makeMove(move2);
    account.set('j1');
    await gameStore.checkResult();
}

test(`firstWin`,async () => {
    await simpleGame(Move.Rock, Move.Lizard);
    assert.equal(rpsMock.winner, 'j1');
});

test(`secondWin`,async () => {
    await simpleGame(Move.Rock, Move.Paper);
    assert.equal(rpsMock.winner, 'j2');
});

test(`draw`,async () => {
    await simpleGame(Move.Rock, Move.Rock);
    assert.equal(rpsMock.winner, '');
});

test(`j2timeout`,async () => {
    gameStore.create();
    gameStore.patch({
        move: Move.Rock,
        stake: '1',
        j2: 'j2',
    })
    await gameStore.start();
    gameStore.gameAddress = 'game';
    gameStore.TIMEOUT = 0;
    while (!gameStore.info.get())
        await Promise.resolve();
    await new Promise(r => setTimeout(r, 10));
    await gameStore.checkResult();
    assert.equal(rpsMock.winner, 'j1');
});


test(`j1timeout`,async () => {
    gameStore.create();
    gameStore.patch({
        move: Move.Rock,
        stake: '1',
        j2: 'j2',
    })
    await gameStore.start();
    gameStore.gameAddress = 'game';
    gameStore.TIMEOUT = 0;
    account.set('j2');
    while (!gameStore.info.get())
        await Promise.resolve();
    await gameStore.makeMove(Move.Paper);
    await new Promise(r => setTimeout(r, 10));
    await gameStore.checkResult();
    assert.equal(rpsMock.winner, 'j2');
});