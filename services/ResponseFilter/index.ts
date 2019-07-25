import Dialog from '../Dialog';
import Loading from '@/services/Loading';

interface IResponseFilter {
    totalLength: number;
    errorLength: number;
    errorMessageList: string[];
}

export class ResponseFilter {
    constructor() {}

    successCheck(viewItem: any, response: any, callback: Function) {
        Loading.hide();
        let responseItem: IResponseFilter = {
            totalLength: 0,
            errorLength: 0,
            errorMessageList: [],
        };

        // response undefined
        if (response == undefined) {
            Dialog.error(viewItem._('w_ErrorResponseUndefined'));
            return false;
        }

        // response.data undefined, not multiple response
        if (response.datas == undefined) {
            callback(response);
            return false;
        }

        // check response data for multiple response
        for (let data of response.datas) {
            responseItem.totalLength++;
            if (data.statusCode == undefined) {
                continue;
            }
            if (typeof data.statusCode == 'number' && data.statusCode != 200) {
                responseItem.errorLength++;
                if (data.message != undefined && typeof data.message == 'string') {
                    responseItem.errorMessageList.push(data.message);
                }
            }
        }
        if (responseItem.errorLength > 0) {
            let message = '';
            for (let errorMessage of responseItem.errorMessageList) {
                message += `${errorMessage}<br>`;
            }
            Dialog.error(message);
        } else {
            callback(response);
        }
    }

    catchError(viewItem: any, e: any, message: string = '') {
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
