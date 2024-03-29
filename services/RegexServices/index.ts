export class RegexService {
    constructor() {}

    regexItem: any = {
        number: /^[\d]*$/,
        email: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/i,
        url: /(ws|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
    };

    replaceItem: any = {
        number: /[^\d]/,
    };

    trim(data: any): any {
        let result = data;
        switch (typeof data) {
            case 'string':
                result = data.trim();
                break;
            case 'object':
                if (data == null) {
                    break;
                }
                if (data.length > 0) {
                    for (let i in data) {
                        data[i] = this.trim(data[i]);
                    }
                } else {
                    let tempKeys = Object.keys(data);
                    for (let key of tempKeys) {
                        data[key] = this.trim(data[key]);
                    }
                }
                break;
            case 'boolean':
            case 'number':
            case 'function':
            case 'undefined':
            default:
                break;
        }
        return result;
    }

    email(data: string): boolean {
        return this.regexItem.email.test(data);
    }

    url(data: string): boolean {
        return this.regexItem.url.test(data);
    }

    number(data: string): boolean {
        return this.regexItem.number.test(data);
    }

    replaceNumber(data: string): string {
        return data.replace(this.replaceItem.number, '');
    }
}

export default new RegexService();
