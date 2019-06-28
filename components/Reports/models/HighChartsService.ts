import { EWeather } from './EHighCharts';

class HighChartsService {
    weatherIcon(weather: EWeather): string {
        let result = '';
        let style = 'font-size:1.1rem;';
        switch (weather) {
            case EWeather.sunny:
                result = `<i class="wi wi-day-sunny" style="${style}"></i>`;
                break;
            case EWeather.cloudy:
                result = `<i class="wi wi-cloudy" style="${style}"></i>`;
                break;
            case EWeather.rain:
                result = `<i class="wi wi-showers" style="${style}"></i>`;
                break;
            default:
                result = `<i class="wi wi-day-sleet-storm" style="${style}"></i>`;
                break;
        }
        return result;
    }
}

export default new HighChartsService();
