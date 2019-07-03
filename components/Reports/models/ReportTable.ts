import { ESign } from './EReport';
import { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut } from './IReportTable';

class ReportTableData {
    _head: string[] = [];
    _body: IReportTableDataBody[] = [];
    _foot: IReportTableDataTotal[] = [];

    constructor() {}

    countTotal() {
        //row total
        for (let item of this._body) {
            item.inTotal = this.showRowTotal(item.in);
            item.outTotal = this.showRowTotal(item.out);

            for (let subItem of item.in) {
                subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
            }

            for (let subItem of item.out) {
                subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
            }
        }

        //column total
        if (this._body && this._body.length > 0) {
            this._foot = [];
            for (let index in this._head) {
                let total: IReportTableDataTotal = {
                    inTotal: this.showColTotal(this._body, index, 'in'),
                    outTotal: this.showColTotal(this._body, index, 'out'),
                };

                this._foot.push(total);
            }
        }

        //all total
        let intTotal: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        intTotal.value = this._foot.reduce((ty, u) => ty + u.inTotal.value, 0);
        intTotal.valueRatio = this._foot.reduce((ty, u) => ty + u.inTotal.valueRatio, 0);
        intTotal.sign = intTotal.valueRatio > 0 ? ESign.positive : ESign.negative;

        let outTotal: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        outTotal.value = this._foot.reduce((ty, u) => ty + u.outTotal.value, 0);
        outTotal.valueRatio = this._foot.reduce((ty, u) => ty + u.outTotal.valueRatio, 0);
        outTotal.sign = outTotal.valueRatio > 0 ? ESign.positive : ESign.negative;

        let allTotal: IReportTableDataTotal = {
            inTotal: intTotal,
            outTotal: outTotal,
        };
        this._foot.push(allTotal);
    }

    showRowTotal(data: IReportTableDataBodyInOut[]) {
        let total: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        total.value = data.reduce((ty, u) => ty + u.value, 0);
        total.valueRatio = data.reduce((ty, u) => ty + u.valueRatio, 0);
        total.sign = total.valueRatio > 0 ? ESign.positive : ESign.negative;
        return total;
    }

    showColTotal(data: IReportTableDataBody[], index: string, key: string) {
        let total: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        total.value = data.reduce((ty, u) => ty + u[key][index].value, 0);
        total.valueRatio = data.reduce((ty, u) => ty + u[key][index].valueRatio, 0);
        total.sign = total.valueRatio > 0 ? ESign.positive : ESign.negative;
        return total;
    }

    translationDataFormat() {
        this._head = this._head.map((x) => new Date(x).getUTCHours() + ':00 - ' + (new Date(x).getUTCHours() + 1) + ':00');
    }

    set head(value: string[]) {
        this._head = value;
        this.translationDataFormat();
    }

    get head() {
        return this._head;
    }

    set body(value: IReportTableDataBody[]) {
        this._body = value;
        this.countTotal();
    }

    get foot() {
        return this._foot;
    }
}

export { ReportTableData };
