import { EWeather, EChartMode } from '../';
import { ISite, ISiteOfficeHourItem, IDayRange } from '../';
import Datetime from '@/services/Datetime';

class HighchartsService {
    readonly mathRoundLength = 2;
    readonly datetimeFormat = {
        year: 'YYYY',
        month: 'YYYY/MM',
        date: 'YYYY/MM/DD',
        time: 'HH:mm',
    };

    categoriesQuarter(date: Date): string {
        let result = '';
        let quarterNumber = Datetime.QuarterNumber(date);
        result += `${date.getFullYear()}-Q${quarterNumber}`;
        return result;
    }

    categoriesWeek(date: Date): string {
        let result = '';
        let weekNumber = Datetime.WeekNumber(date);
        result += `${date.getFullYear()}-W${weekNumber}`;
        return result;
    }

    siteOfficeHour(weekDay: number, officeHour: IDayRange[]): ISiteOfficeHourItem {
        let result: ISiteOfficeHourItem = {
            startHour: 25,
            endHour: -1,
        };
        for (let dayRange of officeHour) {
            let inday: boolean = this.WeekInDay(weekDay, parseInt(dayRange.startDay), parseInt(dayRange.endDay));
            if (inday) {
                let indayStartDate = new Date(dayRange.startDate);
                let indayEndDate = new Date(dayRange.endDate);
                if (isNaN(indayStartDate.getTime())) {
                    break;
                }
                if (isNaN(indayEndDate.getTime())) {
                    break;
                }
                let indayStartHour = indayStartDate.getHours();
                let indayEndHour = indayEndDate.getHours();

                if (indayStartHour >= indayEndHour) {
                    result.startHour = 0;
                    result.endHour = 23;
                } else {
                    if (result.startHour > indayStartHour) {
                        result.startHour = indayStartHour;
                    }
                    if (result.endHour < indayEndHour) {
                        result.endHour = indayEndHour;
                    }
                }
                if (result.startHour <= 0 && result.endHour >= 23) {
                    break;
                }
            }
        }

        if (result.startHour > result.endHour) {
            result.startHour = 0;
            result.endHour = 23;
        }

        return result;
    }

    categorieStringNotJSON(showString: string, value: string) {
        return `${showString} <span style='display:none;'>__${value}__</span>`;
    }

    categorieStringWithJSON(showString: string, value: any) {
        return `${showString} <span style='display:none;'>${JSON.stringify(value)}</span>`;
    }

    formatFloat(num: number) {
        var size = Math.pow(10, this.mathRoundLength);
        return Math.round(num * size) / size;
    }

    chartMode(startDate: Date, endDate: Date, sites: ISite[]): EChartMode {
        let result = EChartMode.none;
        let startDateString = Datetime.DateTime2String(startDate, this.datetimeFormat.date);
        let endDateString = Datetime.DateTime2String(endDate, this.datetimeFormat.date);
        if (sites.length == 1 && startDateString == endDateString) {
            result = EChartMode.site1Day1;
        } else if (sites.length == 1 && startDateString != endDateString) {
            result = EChartMode.site1DayX;
        } else if (sites.length > 1 && startDateString == endDateString) {
            result = EChartMode.siteXDay1;
        } else if (sites.length > 1 && startDateString != endDateString) {
            result = EChartMode.siteXDayX;
        }
        return result;
    }

    weatherIcon(weather: EWeather, style: string = 'font-size:1.1rem; color:#924da3;'): string {
        let result = '';
        switch (weather) {
            case EWeather.clearDay:
                result = `<i class="wi wi-day-sunny" style="${style}"></i>`;
                break;

            case EWeather.clearNight:
                result = `<i class="wi wi-night-clear" style="${style}"></i>`;
                break;

            case EWeather.rain:
                result = `<i class="wi wi-rain" style="${style}"></i>`;
                break;

            case EWeather.snow:
                result = `<i class="wi wi-snow" style="${style}"></i>`;
                break;

            case EWeather.sleet:
                result = `<i class="wi wi-sleet" style="${style}"></i>`;
                break;

            case EWeather.wind:
                result = `<i class="wi wi-strong-wind" style="${style}"></i>`;
                break;

            case EWeather.fog:
                result = `<i class="wi wi-fog" style="${style}"></i>`;
                break;

            case EWeather.cloudy:
                result = `<i class="wi wi-cloudy" style="${style}"></i>`;
                break;

            case EWeather.partlyCloudyDay:
                result = `<i class="wi wi-day-cloudy" style="${style}"></i>`;
                break;

            case EWeather.partlyCloudyNight:
                result = `<i class="wi wi-night-alt-cloudy" style="${style}"></i>`;
                break;

            case EWeather.none:
            default:
                result = `<i class="fa fa-question" style="${style}"></i>`;
                break;
        }
        return result;
    }

    // check day in range
    WeekInDay(weekDay: number, startDay: number, endDay: number): boolean {
        let result = false;
        let have7 = false;
        let inRange = false;
        let startDayHave7 = startDay - 7;
        let endDayHave7 = endDay + 7;
        if (startDay > endDay) {
            have7 = true;
        }
        if (weekDay >= startDay && weekDay <= endDay) {
            result = true;
        }
        if (have7 && weekDay >= startDayHave7 && weekDay <= endDay) {
            result = true;
        }
        if (have7 && weekDay >= startDay && weekDay <= endDayHave7) {
            result = true;
        }
        return result;
    }
}

export default new HighchartsService();
