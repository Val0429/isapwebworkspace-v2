import Dialog from "./Dialog/Dialog";

export class ResponseFilter {
    constructor() {}

    base(viewItem: any, e: any) {
        console.log('error: ', e);
        if (!e.res) {
            return false;
        }
        if (!e.res.statusCode) {
            return false;
        }
        if (e.res.statusCode == 401) {
            viewItem.$router.push({ path: '/' });
            return true;
        }
        return true;
    }

    customMessage (viewItem: any, e: any, message: string) {
         if (!e.res) {
            return false;
        }
        if (!e.res.statusCode) {
            return false;
        }
        if (e.res.statusCode == 401) {
            viewItem.$router.push({ path: '/' });
            return true;
        }
        if (e.res.statusCode == 400) {
             Dialog.error(message);
            return true;
        }
        return true;
    }
}

export default new ResponseFilter();
