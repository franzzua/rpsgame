import assert from "node:assert";

export class RPSMock {
    constructor(game) {
        this.game = game;
        this._lastAction = +new Date() / 1000;
    }
    winner;

    async c1Hash() {
        return this.game.salt;
    }

    _c2 = null;

    async c2() {
        return this._c2;
    }

    async j1() {
        return 'j1';
    }

    async j1Timeout() {
        assert.equal(this.winner, undefined);
        this.winner = 'j2';
    }

    async j2() {
        return 'j2';
    }

    async j2Timeout() {
        assert.equal(this._c2, null);
        this.winner = 'j1';
    }

    _lastAction;

    async lastAction() {
        return this._lastAction;
    }

    async play(move) {
        this._c2 = move;
        this._lastAction = +new Date() / 1000;
    }

    async solve(move, salt) {
        assert.equal(move, this.game.move);
        assert.equal(salt, this.game.salt);
        if (move == this._c2)
            this.winner = ''
        else
            this.winner = this.getWin(move) ? 'j1' : 'j2';
    }

    getWin(move) {
        if (move % 2 == this._c2 % 2)
            return (move < this._c2);
        else
            return (move > this._c2);
    }

    async stake() {
        return 1;
    }

    async win() {
    }

    async getAddress() {
        return this.game.salt;
    }
}