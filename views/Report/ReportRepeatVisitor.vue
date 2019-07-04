<template>
    <div class="animated fadeIn">
        <div v-show="pageStep === ePageStep.none">

            <!-- Morris -->
            <highcharts-repeat-visitor
                :startDate="startDate"
                :endDate="endDate"
                :sites="sites"
                :timeMode="timeMode"
                :areaMode="areaMode"
                :value="chartDatas"
            >
            </highcharts-repeat-visitor>
            <!-- Morris -->

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

import Datetime from "@/services/Datetime";
import HighchartRepeatVisitor from "@/components/Reports/HighchartRepeatVisitor.vue";
import {
    EAreaMode,
    EDayXSiteX,
    EPageType,
    ESign,
    ETimeMode,
    EWeather,
    IChartOccupancyData,
    IPeckTimeRange,
    ISiteAreas,
    ISiteItems,
    ReportDashboard,
    ReportTableData
} from "@/components/Reports";

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportRepeatVisitor extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISiteAreas[] = [];
    chartDatas: IChartOccupancyData[] = [];
    ////////////////////////////////////// Morris End //////////////////////////////////////

    created() {
        this.initChartDeveloper();
    }

    mounted() {}

    // Morris //
    initChartDeveloper() {
        this.timeMode = ETimeMode.day;
        this.areaMode = EAreaMode.all;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // multipe day
        this.startDate = new Date("2019-06-20T08:00:00.000Z");
        this.endDate = new Date("2019-08-10T14:00:00.000Z");

        let siteLength = 3;

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
                ],
                areas: [
                    {
                        objectId: "area1" + tempJ.toString(),
                        name: "Area 1" + tempJ.toString()
                    },
                    {
                        objectId: "area2" + tempJ.toString(),
                        name: "Area 2" + tempJ.toString()
                    }
                    // {
                    //     objectId: "area3" + tempJ.toString(),
                    //     name: "Area 3" + tempJ.toString()
                    // },
                    // {
                    //     objectId: "area4" + tempJ.toString(),
                    //     name: "Area 4" + tempJ.toString()
                    // },
                    // {
                    //     objectId: "area5" + tempJ.toString(),
                    //     name: "Area 5" + tempJ.toString()
                    // }
                ]
            });

            for (let i = 1; i < 30; i++) {
                let weather = EWeather.none;
                let tempWeatherNumber = Math.floor(Math.random() * 300);

                if (tempWeatherNumber % 10 == 0) {
                    weather = EWeather.clearDay;
                } else if (tempWeatherNumber % 10 == 1) {
                    weather = EWeather.clearNight;
                } else if (tempWeatherNumber % 10 == 2) {
                    weather = EWeather.rain;
                } else if (tempWeatherNumber % 10 == 3) {
                    weather = EWeather.snow;
                } else if (tempWeatherNumber % 10 == 4) {
                    weather = EWeather.sleet;
                } else if (tempWeatherNumber % 10 == 5) {
                    weather = EWeather.wind;
                } else if (tempWeatherNumber % 10 == 6) {
                    weather = EWeather.fog;
                } else if (tempWeatherNumber % 10 == 7) {
                    weather = EWeather.cloudy;
                } else if (tempWeatherNumber % 10 == 8) {
                    weather = EWeather.partlyCloudyDay;
                } else if (tempWeatherNumber % 10 == 9) {
                    weather = EWeather.partlyCloudyNight;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(
                    `2019-07-${iString10}T${iString10}:00:00.000Z`
                );

                for (let area of this.sites[j].areas) {
                    let tempChartData: IChartOccupancyData = {
                        date: tempDate,
                        siteObjectId: "site" + (j + 1).toString(),
                        temperatureMin: iNumber,
                        temperatureMax: iNumber,
                        weather: weather,
                        areaId: area.objectId,
                        occupancy: Math.floor(Math.random() * 50)
                    };
                    if (!isNaN(tempChartData.date.getTime())) {
                        this.chartDatas.push(tempChartData);
                    }
                }
            }
        }
    }
    // Morris //
}
</script>


<style lang="scss" scoped>
</style>




