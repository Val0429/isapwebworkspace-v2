import { ESign, EChartMode } from './EReport';
import { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut } from './IReportTable';

class ReportTableData {
    _thatDay?: Date;
    _noFoot: boolean = false;
    _chartMode: EChartMode = EChartMode.none;
    _head: string[] = [];
    _body: IReportTableDataBody[] = [];
    _foot: IReportTableDataTotal[] = [];

    constructor() {}

    countTotal() {
        //row total
        for (let item of this._body) {
            //in1 out1
            item.inTotal = this.showRowTotal(item.in);
            item.outTotal = this.showRowTotal(item.out);
            for (let subItem of item.in) {
                subItem.sign = ESign.none;
                if (subItem.valueRatio != 0) {
                    subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                }
            }

            for (let subItem of item.out) {
                subItem.sign = ESign.none;
                if (subItem.valueRatio != 0) {
                    subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                }
            }

            //in2 out2
            if (item.in2) {
                item.inTotal2 = this.showRowTotal(item.in2);
                for (let subItem of item.in2) {
                    subItem.sign = ESign.none;
                    if (subItem.valueRatio != 0) {
                        subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                    }
                }
            }

            if (item.in2) {
                item.outTotal2 = this.showRowTotal(item.out2);
                for (let subItem of item.out2) {
                    subItem.sign = ESign.none;
                    if (subItem.valueRatio != 0) {
                        subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                    }
                }
            }
        }

        if (this._noFoot) {
            return;
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
        if (intTotal.valueRatio) {
            intTotal.sign = intTotal.valueRatio > 0 ? ESign.positive : ESign.negative;
        }

        let outTotal: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        outTotal.value = this._foot.reduce((ty, u) => ty + u.outTotal.value, 0);
        outTotal.valueRatio = this._foot.reduce((ty, u) => ty + u.outTotal.valueRatio, 0);
        if (outTotal.valueRatio) {
            outTotal.sign = outTotal.valueRatio > 0 ? ESign.positive : ESign.negative;
        }

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
        if (data) {
            total.value = data.reduce((ty, u) => ty + u.value, 0);
            total.valueRatio = data.reduce((ty, u) => ty + u.valueRatio, 0);
            if (total.valueRatio != 0) {
                total.sign = total.valueRatio > 0 ? ESign.positive : ESign.negative;
            }
        }
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
        if (total.valueRatio != 0) {
            total.sign = total.valueRatio > 0 ? ESign.positive : ESign.negative;
        }
        return total;
    }

    translationDataFormat() {
        switch (this._chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                break;
            case EChartMode.site1DayX:
            case EChartMode.siteXDayX:
                break;
        }
    }

    set chartMode(value: EChartMode) {
        this._chartMode = value;
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

    set noFoot(value: boolean) {
        this._noFoot = value;
    }

    get noFoot() {
        return this._noFoot;
    }

    get foot() {
        return this._foot;
    }

    set thatDay(value: Date) {
        this._thatDay = value;
    }
    get thatDay() {
        return this._thatDay;
    }
}

export { ReportTableData };
