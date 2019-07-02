<template>
    <div class="animated fadeIn">
        <div v-show="pageStep === ePageStep.none">
            <iv-card>

                <!-- Morris -->
                <highcharts-demographic
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :value="value"
                >
                </highcharts-demographic>
                <!-- Morris -->

            </iv-card>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Morris
import {
    ETimeMode,
    EAreaMode,
    EWeather,
    ISite,
    IDayRange,
    IChartTrafficData
} from "@/components/Reports";
import HighchartsDemographic from "@/components/Reports/HighchartsDemographic.vue";

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportDemographic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    value: IChartTrafficData[] = [];
    ////////////////////////////////////// Morris End //////////////////////////////////////

    created() {
        this.initChartDeveloper();
    }

    mounted() {}

    // Morris //
    initChartDeveloper() {
        this.timeMode = ETimeMode.week;
        this.areaMode = EAreaMode.single;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // multipe day
        // this.startDate = new Date("2019-06-20T08:00:00.000Z");
        // this.endDate = new Date("2019-08-10T14:00:00.000Z");

        let siteLength = 1;

        for (let j = 0; j < siteLength; j++) {
            let tempJ = j + 1;
            this.sites.push({
                objectId: "site" + tempJ.toString(),
                name: "Site " + tempJ.toString(),
                officeHour: [
                    {
                        startDay: "0",
                        endDay: "6",
                        startDate: "2000-01-01T00:00:00.000Z",
                        endDate: "2000-01-01T14:00:00.000Z"
                    }
                ]
            });

            for (let i = 1; i < 30; i++) {
                let weather = EWeather.none;
                let tmepWeatherNumber = Math.floor(Math.random() * 300);

                if (tmepWeatherNumber % 10 == 0) {
                    weather = EWeather.clearDay;
                } else if (tmepWeatherNumber % 10 == 1) {
                    weather = EWeather.clearNight;
                } else if (tmepWeatherNumber % 10 == 2) {
                    weather = EWeather.rain;
                } else if (tmepWeatherNumber % 10 == 3) {
                    weather = EWeather.snow;
                } else if (tmepWeatherNumber % 10 == 4) {
                    weather = EWeather.sleet;
                } else if (tmepWeatherNumber % 10 == 5) {
                    weather = EWeather.wind;
                } else if (tmepWeatherNumber % 10 == 6) {
                    weather = EWeather.fog;
                } else if (tmepWeatherNumber % 10 == 7) {
                    weather = EWeather.cloudy;
                } else if (tmepWeatherNumber % 10 == 8) {
                    weather = EWeather.partlyCloudyDay;
                } else if (tmepWeatherNumber % 10 == 9) {
                    weather = EWeather.partlyCloudyNight;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(`2019-07-02T${iString10}:00:00.000Z`);
                let trafficChartData: IChartTrafficData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperature: iNumber,
                    temperatureMin: iNumber,
                    temperatureMax: iNumber,
                    traffic: Math.floor(Math.random() * 500),
                    revenue: Math.floor(Math.random() * 1000),
                    transaction: Math.floor(Math.random() * 50),
                    weather: weather
                };
                this.value.push(trafficChartData);
            }
        }
    }
    // Morris //
}
</script>


<style lang="scss" scoped>
</style>




