import { EWeather } from './EHighCharts';

class HighChartsService {
    weatherIcon(weather: EWeather): string {
        let result = '';
        switch (weather) {
            case EWeather.sunny:
                result = '<i class="wi wi-night-sleet"></i>';
                break;
            case EWeather.cloudy:
                result = '<i class="wi wi-night-sleet"></i>';
                break;
            case EWeather.rain:
                result = '<i class="wi wi-night-sleet"></i>';
                break;
            default:
                break;
        }
        return result;
    }
}

export default new HighChartsService();
