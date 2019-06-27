<template>
    <div class="animated fadeIn">

        <div v-show="pageStep === ePageStep.none">

            <iv-card>
                <!-- Morris -->
                <traffic-chart
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :value="value"
                >
                </traffic-chart>

            </iv-card>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Morris
import TrafficChart from "@/components/HighCharts/TrafficChart.vue";
import {
    EWeather,
    ISite,
    IDayRange,
    ITrafficData
} from "@/components/HighCharts";

enum EPageStep {
    none = "none"
}

@Component({
    components: {
        TrafficChart
    }
})
export default class ReportTraffic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    sites: ISite[] = [];
    value: ITrafficData[] = [];

    created() {
        this.initChartDeveloper();
    }

    mounted() {}

    initChartDeveloper() {
        this.startDate = new Date("2019-06-26T08:00:00.000Z");
        this.endDate = new Date("2019-06-27T14:00:00.000Z");

        this.sites.push({
            objectId: "site-1",
            name: "Site",
            officeHour: [
                {
                    startDay: "0",
                    endDay: "6",
                    startDate: "2000-01-01T00:00:00.000Z",
                    endDate: "2000-01-01T14:00:00.000Z"
                }
            ]
        });

        // this.sites.push({
        //     objectId: "site-2",
        //     name: "Site",
        //     officeHour: [
        //         {
        //             startDay: "0",
        //             endDay: "6",
        //             startDate: "2000-01-01T12:00:00.000Z",
        //             endDate: "2000-01-01T16:00:00.000Z"
        //         }
        //     ]
        // });

        for (let i = 8; i < 16; i++) {
            let iNumber = i;
            let iString = i.toString();
            let iString10 = iNumber < 10 ? `0${iString}` : iString;
            let tempDate = new Date(`2019-06-26T${iString10}:00:00.000Z`);
            let trafficChartData: ITrafficData = {
                datetime: tempDate,
                siteId: "site-2",
                temperature: iNumber,
                traffic: iNumber + 100,
                revenue: iNumber * 1000,
                transaction: iNumber,
                conversion: iNumber / 1000,
                asp: "Unknow",
                weather: EWeather.sunny
            };
            this.value.push(trafficChartData);
        }
    }
}
</script>


<style lang="scss" scoped>
</style>




