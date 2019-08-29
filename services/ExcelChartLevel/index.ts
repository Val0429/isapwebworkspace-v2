export class ExcelChartLevel {
    /**
     * Math round
     * @param x
     * @param position
     */
    Round(x: number, position: number): number {
        try {
            let multiple: number = Math.pow(10, position);
            return Math.round(x * multiple) / multiple;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Percentile
     * @param datas
     * @param percent 0-1
     */
    Percentile(datas: number[], percent: number): number {
        try {
            datas = JSON.parse(JSON.stringify(datas)).sort((a, b) => {
                return a - b;
            });
            let serial: number = (datas.length - 1) * percent;
            let i = Math.floor(serial);
            let j = serial - i;
            let percentile: number = (1 - j) * (datas[i] || 0) + j * (datas[i + 1] || 0);
            return this.Round(percentile, 2);
        } catch (e) {
            throw e;
        }
    }
}

export default new ExcelChartLevel();
