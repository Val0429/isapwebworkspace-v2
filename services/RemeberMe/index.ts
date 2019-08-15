interface ILoginInfo {
    username: string;
    password: string;
}

export class RemeberMe {
    remberMeKey = 'loginInfo';

    saveLogin(loginInfo: ILoginInfo) {
        localStorage.setItem(this.remberMeKey, JSON.stringify(loginInfo));
    }

    clearLogin() {
        localStorage.removeItem(this.remberMeKey);
    }

    getLogin(): ILoginInfo {
        let result: ILoginInfo = {
            username: '',
            password: '',
        };
        try {
            let localInfo = localStorage.getItem(this.remberMeKey);
            if (localInfo == undefined) {
                return result;
            }
            let tempLoginInfo = JSON.parse(String(localInfo)) as ILoginInfo;
            if (tempLoginInfo.username != undefined) {
                result.username = tempLoginInfo.username;
            }
            if (tempLoginInfo.password != undefined) {
                result.password = tempLoginInfo.password;
            }
        } catch (e) {
            console.log('remberMe error: ', e);
        }

        return result;
    }
}

export default new RemeberMe();
