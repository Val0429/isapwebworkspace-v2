import Dialog from './Dialog';
import Loading from '@/services/Loading';

export class ResponseFilter {
    constructor() {}

    base(viewItem: any, e: any, message: string = '') {
        console.log('error: ', e);
        Loading.hide();
        if (e.err != undefined && e.err == 'Failed to fetch') {
            Dialog.error(viewItem._('w_FailedToFetch'));
            return true;
        }
        if (!e.res) {
            return false;
        }
        if (!e.res.statusCode) {
            return false;
        }
        if (e.res.statusCode == 401) {
            viewItem.$router.push({ path: '/login' });
            return true;
        }
        if (message != '') {
            Dialog.error(message);
        }
        return true;
    }
}

export default new ResponseFilter();
