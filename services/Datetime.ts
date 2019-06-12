import Utility from './Utility';

enum DatetimeFormat {
    'default' = 'YYYY/MM/DD HH:mm:ss',
}

class Datetime {

    private _formats: string[] = ['dddd', 'ddd', 'DD', 'D', 'hh', 'h', 'HH', 'H', 'mm', 'm', 'MMMM', 'MMM', 'MM', 'M', 'ss', 's', 'A', 'a', 'YYYY', 'YY', 'ZZ', 'Z'];
    private _days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private _months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private _timeNames: string[] = ['am', 'pm', 'AM', 'PM'];

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

}

export default new Datetime();



