import { EWeather, EChartMode } from './EHighCharts';
import Datetime from '@/services/Datetime';
import { ISite } from './IHighCharts';

class HighChartsService {
    mathRoundLength = 2;

    datetimeFormat = {
        year: 'YYYY',
        month: 'YYYY/MM',
        date: 'YYYY/MM/DD',
        time: 'HH:mm',
    };

    chartMode(startDate: Date, endDate: Date, sites: ISite[]): EChartMode {
        let result = EChartMode.none;
        let startDateString = Datetime.DateTime2String(startDate, this.datetimeFormat.date);
        let endDateString = Datetime.DateTime2String(endDate, this.datetimeFormat.date);
        if (startDateString == endDateString && sites.length == 1) {
            result = EChartMode.day1Site1;
        } else if (startDateString == endDateString && sites.length > 1) {
            result = EChartMode.day1SiteX;
        } else if (startDateString != endDateString && sites.length == 1) {
            result = EChartMode.dayXSite1;
        } else if (startDateString != endDateString && sites.length > 1) {
            result = EChartMode.dayXSiteX;
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
}

export default new HighChartsService();
