export class RegexService {
    constructor() {}

    regexItem: any = {
        url: /(ws|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
        number: /^[0-9]*$/,
    };

    url(data: string): boolean {
        return this.regexItem.url.test(data);
    }

    number(data: string): boolean {
        return this.regexItem.number.test(data);
    }
}

export default new RegexService();
