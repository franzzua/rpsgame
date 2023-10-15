import {Fn, cell} from "@cmmn/cell/lib";
class AccountService {

    @cell
    public Account: string | undefined;

    constructor() {
        window.ethereum.on('chainChanged', this.handleChainChanged);
        window.ethereum.on('accountsChanged', this.handleAccountsChanged);
        this.getAccounts().catch();
    }

    public async getAccounts() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        this.Account = accounts[0];
    }

    private handleAccountsChanged = (accounts: string[]) => {
        this.Account = accounts[0];
    }

    private handleChainChanged = (e: any) => {
        console.log(e);
    }
}

export const accountService = new AccountService();