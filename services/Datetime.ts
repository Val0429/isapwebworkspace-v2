import Utility from './Utility';

enum DatetimeFormat {
    'default' = 'YYYY/MM/DD HH:mm:ss',
}

class Datetime {
    private _formats: string[] = ['dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'];
    private _days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private _months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private _timeNames: string[] = ['am', 'pm', 'AM', 'PM'];

    private _oneDayTimestamp = 86400000;

    /**
     * Convert date to format string like C#
     * @param dateTime
     * @param format 'dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'
     */
    DateTime2String(dateTime: Date, format: DatetimeFormat | string = DatetimeFormat.default): string {
        return this.ToString(dateTime, format);
    }

    /**
     * Convert date to format string like C#
     * @param dateTime
     * @param format 'dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'
     */
    ToString(dateTime: Date, format: DatetimeFormat | string = DatetimeFormat.default): string {
        let regex: RegExp = Utility.Array2RegExp(this._formats);

        let formats: string[] = format.match(regex) || [];
        let spaces: string[] = format.split(regex);

        let year: number = dateTime.getFullYear();
        let month: number = dateTime.getMonth();
        let day: number = dateTime.getDay();
        let date: number = dateTime.getDate();
        let hour: number = dateTime.getHours();
        let minute: number = dateTime.getMinutes();
        let second: number = dateTime.getSeconds();
        let offset: number = dateTime.getTimezoneOffset() + 30;

        let dateStr: string = '';
        for (let i: number = 0; i < spaces.length; i++) {
            switch (formats[i - 1]) {
                case 'dddd':
                    dateStr += this._days[day + 7];
                    break;
                case 'ddd':
                    dateStr += this._days[day];
                    break;
                case 'DD':
                    dateStr += Utility.PadLeft(date.toString(), '0', 2);
                    break;
                case 'D':
                    dateStr += date.toString();
                    break;
                case 'hh':
                    dateStr += Utility.PadLeft((hour % 12 || 12).toString(), '0', 2);
                    break;
                case 'h':
                    dateStr += (hour % 12 || 12).toString();
                    break;
                case 'HH':
                    dateStr += Utility.PadLeft(hour.toString(), '0', 2);
                    break;
                case 'H':
                    dateStr += hour.toString();
                    break;
                case 'mm':
                    dateStr += Utility.PadLeft(minute.toString(), '0', 2);
                    break;
                case 'm':
                    dateStr += minute.toString();
                    break;
                case 'MMMM':
                    dateStr += this._months[month + 12];
                    break;
                case 'MMM':
                    dateStr += this._months[month];
                    break;
                case 'MM':
                    dateStr += Utility.PadLeft((month + 1).toString(), '0', 2);
                    break;
                case 'M':
                    dateStr += (month + 1).toString();
                    break;
                case 'ss':
                    dateStr += Utility.PadLeft(second.toString(), '0', 2);
                    break;
                case 's':
                    dateStr += second.toString();
                    break;
                case 'A':
                    dateStr += hour < 12 ? this._timeNames[2] : this._timeNames[3];
                    break;
                case 'a':
                    dateStr += hour < 12 ? this._timeNames[0] : this._timeNames[1];
                    break;
                case 'YYYY':
                    dateStr += year.toString();
                    break;
                case 'YY':
                    dateStr += year.toString().slice(2);
                    break;
                case 'ZZ':
                    dateStr += (offset > 0 ? '-' : '+') + Utility.PadLeft((Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60)).toString(), '0', 4);
                    break;
                case 'Z':
                    dateStr += `${offset > 0 ? '-' : '+'}${Math.abs(offset / 60).toString()}`;
                    break;
            }

            dateStr += spaces[i];
        }

        return dateStr;
    }

    /**
     * Convert string to date
     * @param str
     * @param format 'dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'
     */
    String2DateTime(str: string, format: DatetimeFormat | string): Date {
        return this.ToDate(str, format);
    }

    /**
     * Convert string to date
     * @param str
     * @param format 'dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'
     */
    ToDate(str: string, format: DatetimeFormat | string): Date {
        let regex: RegExp = Utility.Array2RegExp(this._formats);

        let formats: string[] = format.match(regex) || [];
        let strs: string[] = formats.reduce((prev, curr, index, array) => {
            let count: number = prev.filter((n) => this._timeNames.indexOf(n) > -1).length;
            prev.push(str.substr(format.indexOf(curr) + count, curr === 'A' || curr === 'a' ? 2 : curr.length));
            return prev;
        }, []);

        let year: number = 0;
        let month: number = 0;
        let day: number = 0;
        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;

        for (let i: number = 0; i < formats.length; i++) {
            switch (formats[i]) {
                case 'dddd':
                    day = this._days.indexOf(strs[i]) - 7;
                    break;
                case 'ddd':
                    day = this._days.indexOf(strs[i]);
                    break;
                case 'DD':
                case 'D':
                    day = parseInt(strs[i]);
                    break;
                case 'hh':
                case 'h':
                    hour = parseInt(strs[i]) + (strs.indexOf('PM') > -1 || strs.indexOf('pm') > -1 ? 12 : 0);
                    break;
                case 'HH':
                case 'H':
                    hour = parseInt(strs[i]);
                    break;
                case 'mm':
                case 'm':
                    minute = parseInt(strs[i]);
                    break;
                case 'MMMM':
                    month = this._months.indexOf(strs[i]) - 7;
                    break;
                case 'MMM':
                    month = this._months.indexOf(strs[i]);
                    break;
                case 'MM':
                case 'M':
                    month = parseInt(strs[i]) - 1;
                    break;
                case 'ss':
                case 's':
                    second = parseInt(strs[i]);
                    break;
                case 'A':
                case 'a':
                    break;
                case 'YYYY':
                    year = parseInt(strs[i]);
                    break;
                case 'YY':
                    year = parseInt(`20${strs[i]}`);
                    break;
                case 'ZZ':
                case 'Z':
                    break;
            }
        }
        return new Date(year, month, day, hour, minute, second);
    }

    // Year
    YearStart(value: Date): Date {
        let date = new Date(value.getTime());
        date.setMonth(0);
        date.setDate(1);
        return this.DateToZero(date);
    }

    YearEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setFullYear(date.getFullYear() + 1);
        date.setMonth(0);
        date.setDate(1);
        date = this.DateToZero(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // Quarter
    QuarterNumber(value: Date): number {
        let date: Date = new Date(value.getTime());
        let month: number = Math.floor(date.getMonth() / 3) + 1;
        return month > 4 ? month - 4 : month;
    }

    QuarterStart(value: Date): Date {
        let date = new Date(value.getTime());
        let quarterNumber = this.QuarterNumber(value);
        let quartStartMonth = (quarterNumber - 1) * 3;
        date.setMonth(quartStartMonth);
        date.setDate(1);
        return this.DateToZero(date);
    }

    QuarterEnd(value: Date): Date {
        let date = new Date(value.getTime());
        let quarterNumber = this.QuarterNumber(value);
        let quartNextStartMonth = quarterNumber * 3;
        date.setMonth(quartNextStartMonth);
        date.setDate(1);
        date = this.DateToZero(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // Month
    MonthStart(value: Date): Date {
        let date = new Date(value.getTime());
        date.setDate(1);
        return this.DateToZero(date);
    }

    MonthEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date = this.DateToZero(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // Week
    WeekNumber(value: Date): number {
        let date = new Date(value.getTime());
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / this._oneDayTimestamp;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    WeekStart(value: Date, start: number = 0): Date {
        let date = new Date(value.getTime());
        if (start == 0) {
            date = this.WeekThisSunday(date);
        } else if (start == 1) {
            date = this.WeekThisMonday(date);
        }
        return date;
    }

    WeekEnd(value: Date, start: number = 0): Date {
        let date = new Date(value.getTime());
        if (start == 0) {
            date = this.WeekNextSunday(date);
        } else if (start == 1) {
            date = this.WeekNextMonday(date);
        }
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    WeekPrevSunday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day - 7;
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    WeekThisSunday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day;
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    WeekNextSunday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + 7;
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    WeekPrevMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? -13 : -6);
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    WeekThisMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? -6 : 1);
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    WeekNextMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? 1 : 8);
        return this.DateToZero(new Date(date.setDate(diff)));
    }

    // date
    DateStart(value: Date): Date {
        let date = new Date(value.getTime());
        return this.DateToZero(date);
    }

    DateEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setDate(date.getDate() + 1);
        date = this.DateToZero(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // set Date to 00:00:00
    DateToZero(value: Date): Date {
        let date = new Date(value.getTime());
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    /////////////////////////////////////////////
    SortDateGap(startDate: Date, endDate: Date): { startDate: Date; endDate: Date } {
        let result = { startDate: startDate, endDate: endDate };
        if (result.startDate.getTime() > result.endDate.getTime()) {
            let tempDate: number = result.startDate.getTime();
            result.startDate = new Date(result.endDate.getTime());
            result.endDate = new Date(tempDate);
        }
        return result;
    }

    IsOneDate(startDate: Date, endDate: Date): boolean {
        let result: boolean = false;
        let sortDateItem = this.SortDateGap(startDate, endDate);
        if (sortDateItem.endDate.getTime() - sortDateItem.startDate.getTime() < this._oneDayTimestamp) {
            result = true;
        }
        return result;
    }

    DateList(startDate: Date, endDate: Date): Date[] {
        let result = [];
        let sortDateItem = this.SortDateGap(startDate, endDate);
        let loopTimestamp = sortDateItem.startDate.getTime();
        let endTimeStamp = sortDateItem.endDate.getTime();
        result.push(new Date(loopTimestamp));
        while (loopTimestamp < endTimeStamp) {
            loopTimestamp += this._oneDayTimestamp;
            result.push(new Date(loopTimestamp));
        }
        return result;
    }

    /////////////////////////////////////////////

    // 檢查日期的結束時間不能小於開始值間
    CheckDate(startDate: Date, endDate: Date) {
        return this.DateToZero(endDate).getTime() >= this.DateToZero(startDate).getTime();
    }

    // 檢查日期的開始和結束時間是否為同一天
    CheckTheSameDate(startDate: string, endDate: string) {
        return Date.parse(endDate) === Date.parse(startDate);
    }

    // 以今天為基準，計算往前、往後的幾天
    CountDateNumber(addDayCount: number): string {
        const today = new Date();
        today.setDate(today.getDate() + addDayCount); //獲取addDayCount天後的日期
        const year = today.getFullYear();
        const month = today.getMonth() + 1; //獲取當前月份的日期
        const day = today.getDate();
        const formatMonth = month < 10 ? `0${month}` : month;
        const formatDay = day < 10 ? `0${day}` : day;
        return `${year}-${formatMonth}-${formatDay}`;
    }

    //獲得本月的天數
    ThisMonthDays(year: number, month: number): number {
        const now = new Date(); //當前日期

        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const thisMonthDays = new Date(nowYear, nowMonth + 1, 0).getDate();
        return thisMonthDays;
    }

    //獲得上月的天數
    LastMonthDays(year: number, month: number): number {
        const now = new Date(); //當前日期

        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const lastMonthDays = new Date(nowYear, nowMonth, 0).getDate();
        return lastMonthDays;
    }

    //獲得本周的開始日期
    ThisWeekStartDate(): string {
        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return this.DateTime2String(weekStartDate, 'YYYY-MM-DD');
    }

    //獲得本周的結束日期
    ThisWeekEndDate(): string {
        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return this.DateTime2String(weekEndDate, 'YYYY-MM-DD');
    }

    //獲得上周的開始日期
    LastWeekStartDate(): string {
        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
        return this.DateTime2String(weekStartDate, 'YYYY-MM-DD');
    }

    //獲得上周的結束日期
    LastWeekEndDate(): string {
        const now = new Date(); //當前日期
        const nowDayOfWeek = now.getDay(); //今天本周的第幾天 0（周日） 到 6（周六）
        const nowDay = now.getDate(); //當前日
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
        return this.DateTime2String(weekEndDate, 'YYYY-MM-DD');
    }

    //獲得本月的開始日期
    ThisMonthStartDate(): string {
        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const monthStartDate = new Date(nowYear, nowMonth, 1);
        return this.DateTime2String(monthStartDate, 'YYYY-MM-DD');
    }

    //獲得本月的結束日期
    ThisMonthEndDate(): string {
        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

        const monthEndDate = new Date(nowYear, nowMonth, this.ThisMonthDays(nowYear, nowMonth + 1));
        return this.DateTime2String(monthEndDate, 'YYYY-MM-DD');
    }

    //獲得上月開始日期
    LastMonthStartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastYear = lastMonthDate.getFullYear();
        const lastMonth = lastMonthDate.getMonth();

        const lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return this.DateTime2String(lastMonthStartDate, 'YYYY-MM-DD');
    }

    //獲得上月結束日期
    LastMonthEndDate(): string {
        const now = new Date(); //當前日期
        const nowMonth = now.getMonth(); //當前月 0（1月）到 11（12月）
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        let lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();

        const lastMonthEndDate = new Date(nowYear, lastMonth, this.LastMonthDays(nowYear, nowMonth));
        return this.DateTime2String(lastMonthEndDate, 'YYYY-MM-DD');
    }

    //獲得Q1開始日期
    Q1StartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q1StartDate = new Date(nowYear, 0, 1);
        return this.DateTime2String(Q1StartDate, 'YYYY-MM-DD');
    }

    //獲得Q1結束日期
    Q1EndDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q1EndDate = new Date(nowYear, 2, 31);
        return this.DateTime2String(Q1EndDate, 'YYYY-MM-DD');
    }

    //獲得Q2開始日期
    Q2StartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q2StartDate = new Date(nowYear, 3, 1);
        return this.DateTime2String(Q2StartDate, 'YYYY-MM-DD');
    }

    //獲得Q2結束日期
    Q2EndDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q2EndDate = new Date(nowYear, 5, 30);
        return this.DateTime2String(Q2EndDate, 'YYYY-MM-DD');
    }

    //獲得Q3開始日期
    Q3StartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q3StartDate = new Date(nowYear, 6, 1);
        return this.DateTime2String(Q3StartDate, 'YYYY-MM-DD');
    }

    //獲得Q3結束日期
    Q3EndDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q3EndDate = new Date(nowYear, 8, 30);
        return this.DateTime2String(Q3EndDate, 'YYYY-MM-DD');
    }

    //獲得Q4開始日期
    Q4StartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q4StartDate = new Date(nowYear, 9, 1);
        return this.DateTime2String(Q4StartDate, 'YYYY-MM-DD');
    }

    //獲得Q4結束日期
    Q4EndDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const Q4EndDate = new Date(nowYear, 11, 31);
        return this.DateTime2String(Q4EndDate, 'YYYY-MM-DD');
    }

    //獲得ThisYear開始日期
    ThisYearStartDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const thisYearStartDate = new Date(nowYear, 0, 1);
        return this.DateTime2String(thisYearStartDate);
    }

    //獲得ThisYear結束日期
    ThisYearEndDate(): string {
        const now = new Date(); //當前日期
        let nowYear = now.getFullYear(); //當前年
        nowYear += nowYear < 2000 ? 1900 : 0;

        const lastYearEndDate = new Date(nowYear, 11, 31);
        return this.DateTime2String(lastYearEndDate);
    }
}

export default new Datetime();
