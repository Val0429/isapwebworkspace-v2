export class RegexService {
    constructor() {}

    regexItem: any = {
        url: /(ws|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
    };

    url(data: string): boolean {
        return this.regexItem.url.test(data);
    }
}

export default new RegexService();
