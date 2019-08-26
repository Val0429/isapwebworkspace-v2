<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_PeakHour')"
        >
            <apexchart type=heatmap height=550 :options="chartOptions" :series="series" />

            <div>
                <select-permission-site @siteIds="receiveSiteIds"></select-permission-site>

                <select-time
                    class="col-md-6"
                    :timeParam="time"
                    @time="receiveTime"
                ></select-time>
            </div>


        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

/// install Highcharts
import VueApexCharts from 'vue-apexcharts'
Vue.component('apexchart', VueApexCharts)

@Component({
    components: { apexchart: VueApexCharts }
})
export class Peakhour extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    label: string;

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    chartOptions: any = {};
    series: any = [];

    created() {
    }

    mounted() {
        this.initCharts();
    }

    receiveSiteIds(siteIds: object) {
        console.log('siteIds ~ ', siteIds)
    }

    generateData(count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = 'w' + (i + 1).toString();
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push({
                x: x,
                y: y
            });
            i++;
        }
        return series;
    }

    initCharts() {
        this.series = [
            {
            name: 'Jan',
            data: this.generateData(7, {
                min: -30,
                max: 55
            })
            },
            {
                name: 'Feb',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Mar',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Apr',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'May',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jun',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jul',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Aug',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Sep',
                data: this.generateData(7, {
                    min: -30,
                    max: 55
                })
            }
        ];
            this.chartOptions = {
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,

                        colorScale: {
                        ranges: [{
                            from: -30,
                            to: 5,
                            name: 'low',
                            color: '#F4F6F8'
                        },
                            {
                                from: 6,
                                to: 20,
                                name: 'medium',
                                color: '#128FD9'
                            },
                            {
                                from: 21,
                                to: 45,
                                name: 'high',
                                color: '#FFB200'
                            },
                            {
                                from: 46,
                                to: 55,
                                name: 'extreme',
                                color: '#FF0000'
                            }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: false
            },

            title: {
                text: 'HeatMap Chart with Color Range'
            }
        }


    }

}

export default Peakhour;
Vue.component("peak-hour", Peakhour);
</script>

<style lang="scss" scoped>
</style>
