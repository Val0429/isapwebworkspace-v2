import Utility from '../Utility';

enum DatetimeFormat {
    'default' = 'YYYY-MM-DD HH:mm:ss',
}

enum DateFormat {
    'default' = 'YYYY-MM-DD',
}
class Datetime {
    private _formats: string[] = ['dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'];
    private _days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private _months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private _timeNames: string[] = ['am', 'pm', 'AM', 'PM'];

    private _oneDayTimestamp = 86400000;

    get oneDayTimestamp() {
        return this._oneDayTimestamp;
    }

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
        return this.DateStart(date);
    }

    YearEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setFullYear(date.getFullYear() + 1);
        date.setMonth(0);
        date.setDate(1);
        date = this.DateStart(date);
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
        return this.DateStart(date);
    }

    QuarterEnd(value: Date): Date {
        let date = new Date(value.getTime());
        let quarterNumber = this.QuarterNumber(value);
        let quartNextStartMonth = quarterNumber * 3;
        date.setMonth(quartNextStartMonth);
        date.setDate(1);
        date = this.DateStart(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // 獲得Q1開始日期
    Q1StartDate(date: Date): Date {
        return this.DateStart(new Date(date.getFullYear(), 0, 1));
    }

    // 獲得Q1結束日期
    Q1EndDate(date: Date): Date {
        return this.DateEnd(new Date(date.getFullYear(), 2, 31));
    }

    // 獲得Q2開始日期
    Q2StartDate(date: Date): Date {
        return this.DateStart(new Date(date.getFullYear(), 3, 1));
    }

    // 獲得Q2結束日期
    Q2EndDate(date: Date): Date {
        return this.DateEnd(new Date(date.getFullYear(), 5, 30));
    }

    // 獲得Q3開始日期
    Q3StartDate(date: Date): Date {
        return this.DateStart(new Date(date.getFullYear(), 6, 1));
    }

    //獲得Q3結束日期
    Q3EndDate(date: Date): Date {
        return this.DateEnd(new Date(date.getFullYear(), 8, 30));
    }

    // 獲得Q4開始日期
    Q4StartDate(date: Date): Date {
        return this.DateStart(new Date(date.getFullYear(), 9, 1));
    }

    // 獲得Q4結束日期
    Q4EndDate(date: Date): Date {
        return this.DateEnd(new Date(date.getFullYear(), 11, 31));
    }

    // Month
    MonthStart(value: Date): Date {
        let date = new Date(value.getTime());
        date.setDate(1);
        return this.DateStart(date);
    }

    MonthEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date = this.DateStart(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    //獲得上月開始日期
    LastMonthStartDate(date: Date): Date {
        return this.DateStart(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    }

    // 獲得上月結束日期
    LastMonthEndDate(date: Date): Date {
        return this.MonthEnd(new Date(date.getFullYear(), date.getMonth() - 1));
    }

    // 獲得本月的天數
    MonthDateCount(date: Date): number {
        return new Date(date.getFullYear(), date.getMinutes() + 1, 0).getDate();
    }

    // 獲得上月的天數
    LastMonthCount(date: Date): number {
        return this.LastMonthEndDate(date).getDate();
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
        return this.DateStart(new Date(date.setDate(diff)));
    }

    WeekThisSunday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day;
        return this.DateStart(new Date(date.setDate(diff)));
    }

    WeekNextSunday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + 7;
        return this.DateStart(new Date(date.setDate(diff)));
    }

    WeekPrevMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? -13 : -6);
        return this.DateStart(new Date(date.setDate(diff)));
    }

    WeekThisMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? -6 : 1);
        return this.DateStart(new Date(date.setDate(diff)));
    }

    WeekNextMonday(value: Date): Date {
        let date = new Date(value.getTime());
        let day = date.getDay();
        let diff = date.getDate() - day + (day == 0 ? 1 : 8);
        return this.DateStart(new Date(date.setDate(diff)));
    }

    // date
    DateStart(value: Date): Date {
        let date = new Date(value.getTime());
        date.setHours(0, 0, 0, 0);
        return date;
    }

    DateEnd(value: Date): Date {
        let date = new Date(value.getTime());
        date.setDate(date.getDate() + 1);
        date = this.DateStart(date);
        date.setSeconds(date.getSeconds() - 1);
        return date;
    }

    // 以今天為基準，計算往前、往後的幾天
    DatePlus(date: Date, addDayCount: number): Date {
        let newDate = new Date(date.getTime());
        date.setDate(date.getDate() + addDayCount);
        return newDate;
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

    // 檢查日期的結束時間不能小於開始值間
    CheckDate(startDate: Date, endDate: Date): boolean {
        return this.DateStart(endDate).getTime() >= this.DateStart(startDate).getTime();
    }

    // 檢查日期的開始和結束時間是否為同一天
    CheckSameDate(startDate: string, endDate: string): boolean {
        return Date.parse(endDate) === Date.parse(startDate);
    }

    // Excel Date to JS Date
    excelDateToDate(excelDate: number): Date {
        return new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    }
}

export default new Datetime();
