import { cell } from "@cmmn/cell/lib";

class RouteService {
    private getPath = () => location.pathname.split('/').slice(1);
    @cell
    public path = this.getPath();

    constructor() {
        window.addEventListener('popstate', e => {
            this.path = this.getPath();
        })
    }

    goTo(path: string[] | string, replace = false){
        if (Array.isArray(path)) path = '/'+path.join('/');
        history[(replace ? 'replaceState' : 'pushState')](null, '', path);
    }
}

export const routeService = new RouteService();