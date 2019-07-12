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
            //item1 item2
            item.item1Total = this.showRowTotal(item.item1);
            item.item2Total = this.showRowTotal(item.item2);
            for (let subItem of item.item1) {
                subItem.sign = ESign.none;
                if (subItem.valueRatio != 0) {
                    subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                }
            }

            for (let subItem of item.item2) {
                subItem.sign = ESign.none;
                if (subItem.valueRatio != 0) {
                    subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                }
            }

            //item3 item4
            if (item.item3) {
                item.item3Total = this.showRowTotal(item.item3);
                for (let subItem of item.item3) {
                    subItem.sign = ESign.none;
                    if (subItem.valueRatio != 0) {
                        subItem.sign = subItem.valueRatio > 0 ? ESign.positive : ESign.negative;
                    }
                }
            }

            if (item.item4) {
                item.item4Total = this.showRowTotal(item.item4);
                for (let subItem of item.item4) {
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
                    item1Total: this.showColTotal(this._body, index, 'item1'),
                    item2Total: this.showColTotal(this._body, index, 'item2'),
                };

                this._foot.push(total);
            }
        }

        //all total
        let item1Total: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };

        item1Total.value = this._foot.reduce((ty, u) => ty + u.item1Total.value, 0);
        item1Total.valueRatio = this._foot.reduce((ty, u) => ty + u.item1Total.valueRatio, 0);
        if (item1Total.valueRatio) {
            item1Total.sign = item1Total.valueRatio > 0 ? ESign.positive : ESign.negative;
        }

        let item2Total: IReportTableDataBodyInOut = {
            sign: ESign.none,
            value: 0,
            valueRatio: 0,
        };
        item2Total.value = this._foot.reduce((ty, u) => ty + u.item2Total.value, 0);
        item2Total.valueRatio = this._foot.reduce((ty, u) => ty + u.item2Total.valueRatio, 0);
        if (item2Total.valueRatio) {
            item2Total.sign = item2Total.valueRatio > 0 ? ESign.positive : ESign.negative;
        }

        let allTotal: IReportTableDataTotal = {
            item1Total: item1Total,
            item2Total: item2Total,
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
