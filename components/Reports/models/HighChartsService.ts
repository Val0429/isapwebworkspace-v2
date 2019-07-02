import { EWeather } from './EHighCharts';

class HighChartsService {
    mathRoundLength = 2;

    datetimeFormat = {
        year: 'YYYY',
        month: 'YYYY/MM',
        date: 'YYYY/MM/DD',
        time: 'HH:mm',
    };

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
