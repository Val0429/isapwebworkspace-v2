class DateCount {


    constructor() {}

    // 格式化日期
    formatDate(dateArg: any): string {
        const date = new Date(dateArg);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formatMonth = month < 10 ? `0${month}` : month;
        const formatDay = day < 10 ? `0${day}` : day;

        return `${year}-${formatMonth}-${formatDay}`
    }

    // 以今天為基準，計算往前、往後的幾天
    getDateStr(addDayCount: number): string {
        const today = new Date();
        today.setDate(today.getDate() + addDayCount);   //獲取addDayCount天後的日期
        const year = today.getFullYear();
        const month = today.getMonth() + 1;   //獲取當前月份的日期
        const day = today.getDate();
        const formatMonth = month < 10 ? `0${month}` : month;
        const formatDay = day < 10 ? `0${day}` : day;
        return `${year}-${formatMonth}-${formatDay}`
    }

    //獲得本月的天數
    getThisMonthDays(year: number, month: number){
        const now = new Date(); //當前日期

        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);


        const thisMonthDays = new Date(nowYear, nowMonth + 1, 0).getDate();
        return thisMonthDays
    }

    //獲得上月的天數
    getLastMonthDays(year: number, month: number){
        const now = new Date(); //當前日期

        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const lastMonthDays = new Date(nowYear, nowMonth, 0).getDate();
        return lastMonthDays
    }

    //獲得本周的開始日期
    getWeekStartDate() {
        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return this.formatDate(weekStartDate);
    }

    //獲得本周的結束日期
    getWeekEndDate() {

        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return this.formatDate(weekEndDate);
    }

    //獲得上周的開始日期
    getLastWeekStartDate() {

        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
        return this.formatDate(weekStartDate);
    }
    //獲得上周的結束日期
    getLastWeekEndDate() {

        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
        return this.formatDate(weekEndDate);
    }

    //獲得本月的開始日期
    getMonthStartDate(){

        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const monthStartDate = new Date(nowYear, nowMonth, 1);
        return this.formatDate(monthStartDate);
    }

    //獲得本月的結束日期
    getMonthEndDate(){

        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const monthEndDate = new Date(nowYear, nowMonth, this.getThisMonthDays(nowYear, nowMonth + 1));
        return this.formatDate(monthEndDate);
    }

    //獲得上月開始日期
    getLastMonthStartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastYear = lastMonthDate.getFullYear();
        const lastMonth = lastMonthDate.getMonth();

        const lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return this.formatDate(lastMonthStartDate);
    }

    //獲得上月結束日期
    getLastMonthEndDate(){

        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();

        const lastMonthEndDate = new Date(nowYear, lastMonth, this.getLastMonthDays(nowYear, nowMonth));
        return this.formatDate(lastMonthEndDate);
    }

    //獲得Q1開始日期
    getQ1StartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q1StartDate = new Date(nowYear, 0, 1);
        return this.formatDate(Q1StartDate);
    }

    //獲得Q1結束日期
    getQ1EndDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q1EndDate = new Date(nowYear, 2, 31);
        return this.formatDate(Q1EndDate);
    }

    //獲得Q2開始日期
    getQ2StartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q2StartDate = new Date(nowYear, 3, 1);
        return this.formatDate(Q2StartDate);
    }

    //獲得Q2結束日期
    getQ2EndDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q2EndDate = new Date(nowYear, 5, 30);
        return this.formatDate(Q2EndDate);
    }

    //獲得Q3開始日期
    getQ3StartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q3StartDate = new Date(nowYear, 6, 1);
        return this.formatDate(Q3StartDate);
    }

    //獲得Q3結束日期
    getQ3EndDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q3EndDate = new Date(nowYear, 8, 30);
        return this.formatDate(Q3EndDate);
    }

    //獲得Q4開始日期
    getQ4StartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q4StartDate = new Date(nowYear, 9, 1);
        return this.formatDate(Q4StartDate);
    }

    //獲得Q4結束日期
    getQ4EndDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const Q4EndDate = new Date(nowYear, 11, 31);
        return this.formatDate(Q4EndDate);
    }

    //獲得ThisYear開始日期
    getThisYearStartDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const thisYearStartDate = new Date(nowYear, 0, 1);
        return this.formatDate(thisYearStartDate);
    }

    //獲得ThisYear結束日期
    getLastYearEndDate(){

        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += (nowYear < 2000) ? 1900 : 0;

        const lastYearEndDate = new Date(nowYear, 11, 31);
        return this.formatDate(lastYearEndDate);
    }

}

export default new DateCount();
