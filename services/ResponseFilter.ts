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
}

export default new ResponseFilter();
