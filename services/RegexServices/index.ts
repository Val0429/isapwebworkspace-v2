export class RegexService {
    constructor() {}

    regexItem: any = {
        url: /(ws|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
        number: /^[\d]*$/,
    };

    url(data: string): boolean {
        return this.regexItem.url.test(data);
    }

    number(data: string): boolean {
        return this.regexItem.number.test(data);
    }

    numberReplace(data: string): string {
        return data.replace(/[^\d]/, '');
    }
}

export default new RegexService();
