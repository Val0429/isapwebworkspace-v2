import { EWeather } from './EHighCharts';

class WeatherService {

    WeatherIcon(icon: string): EWeather {
        switch (icon) {
            case "clear-day":
                return EWeather.clearDay;
            case "clear-night":
                return EWeather.clearNight;
            case "rain":
                return EWeather.rain;
            case "snow":
                return EWeather.snow;
            case "sleet":
                return EWeather.sleet;
            case "wind":
                return EWeather.wind;
            case "fog":
                return EWeather.fog;
            case "cloudy":
                return EWeather.cloudy;
            case "partly-cloudy-day":
                return EWeather.partlyCloudyDay;
            case "partly-cloudy-night":
                return EWeather.partlyCloudyNight;
            default:
                return EWeather.none;
        }
    }


}

export default new WeatherService();
