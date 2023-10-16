import { cell } from "@cmmn/cell/lib";

class RouteService {
    private getPath = () => globalThis.location?.pathname.split('/').slice(1);
    @cell
    public path = this.getPath();

    constructor() {
        globalThis.addEventListener?.('popstate', e => {
            this.path = this.getPath();
        })
    }

    goTo(path: string[] | string, replace = false){
        if (Array.isArray(path)) path = '/'+path.join('/');
        globalThis.history?.[(replace ? 'replaceState' : 'pushState')](null, '', path);
        this.path = this.getPath();
    }
}

export const routeService = new RouteService();