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
    IChartDemographic,
    EAgeRange
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
    value: IChartDemographic[] = [];
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
                let ageRange = EAgeRange.none;
                let tempAgeRangeNumber = Math.floor(Math.random() * 300);

                if (tempAgeRangeNumber % 10 == 0) {
                    ageRange = EAgeRange.low20;
                } else if (tempAgeRangeNumber % 10 == 1) {
                    ageRange = EAgeRange.m21_30;
                } else if (tempAgeRangeNumber % 10 == 2) {
                    ageRange = EAgeRange.m31_40;
                } else if (tempAgeRangeNumber % 10 == 3) {
                    ageRange = EAgeRange.m41_50;
                } else if (tempAgeRangeNumber % 10 == 4) {
                    ageRange = EAgeRange.m51_60;
                } else if (tempAgeRangeNumber % 10 == 5) {
                    ageRange = EAgeRange.upp61;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(`2019-07-02T${iString10}:00:00.000Z`);
                let trafficChartData: IChartDemographic = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    ageRange: ageRange
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




