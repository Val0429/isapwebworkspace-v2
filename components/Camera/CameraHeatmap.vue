<template>
    <div class="animated fadeIn center">
        <div
            class="card-content"
            v-show="heatMapPosition.length > 0"
        >
            <div class="form-group col-md-12 center">
                <div
                    class="canvas-div"
                    style="position:absolute;"
                    ref="heatmap"
                >
                    <canvas
                        class="canvas-snapshot"
                        ref="snapshot"
                        width="600"
                        height="400"
                    ></canvas>
                    <div
                        class="legend-area"
                        v-if="heatMapPosition.length > 0"
                    >
                        <h5 class="center">{{legendTitle}}</h5>
                        <span class="left">{{min}}</span>
                        <span class="right">{{max}}</span>
                        <img
                            id="gradient"
                            src="data:image/png;base64,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"
                        >
                    </div>
                </div>
            </div>
            <div
                class="center"
                v-if="heatMapPosition.length > 0"
            >
                <b-form-input
                    @mousemove="changeAlpha(alpha)"
                    v-model="alpha"
                    type="range"
                    min="0"
                    max="10"
                ></b-form-input>
            </div>
        </div>
        <div
            v-show="heatMapPosition.length === 0"
            class="center canvas-div border border-dark fa-2x"
        >
            N/A
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { IHeatMapData, IHeatMapPosition, IMapImage } from "./IHeatmap";
import Heatmap from "heatmap.js";

@Component({})
export class CameraHeatmap extends Vue {
    //canvas
    private cx: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private canvasEl: HTMLCanvasElement;
    private heatmapCanvs: any;

    private legendTitle: string = "";
    private max: number = 0;
    private min: number = 0;
    private width_r: number = 1; // 寬比例
    private height_r: number = 1; // 高比例
    private alpha: number = 5;

    @Prop({
        type: Object,
        default: () => {
            return {
                name: "Name",
                src:
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                width: 600,
                height: 400
            };
        }
    })
    mapImage: IMapImage;

    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    heatMapPosition: IHeatMapPosition[];

    @Watch("heatMapPosition", { deep: true })
    private watchHeatMapPosition(newVal, oldVal) {
        this.initMap();
    }

    @Watch("mapImage", { deep: true })
    private watchMapImage(newVal, oldVal) {
        this.initMap();
    }

    created() {
        this.legendTitle = this._("w_Navigation_Report_HeatmapLegend");
    }

    mounted() {
        this.initMap();
    }

    initHeatmap() {
        let me = this;
        let heatmapData: IHeatMapData = {
            max: 0,
            data: []
        };

        //clear oragin heatmap
        var elements = document.getElementsByClassName("heatmap-canvas");
        for (let element of elements) {
            var inputParent = element.parentNode;
            inputParent.removeChild(element);
        }

        me.heatmapCanvs = Heatmap.create({
            backgroundColor: "#0000ff",
            container: me.$refs.heatmap as any
        });

        //座標過多熱圖會異常過濾一部分value的座標點 使熱點維持一千點 以免失真
        let heatMapPosition = [];
        let count = 0;
        let count2 = 0;
        for (let position of me.heatMapPosition) {
            count++;
            // if (position.value > 0) {
            //     heatMapPosition.push(position);
            // }
            // heatMapPosition.push(position);
            if (count % Math.round(me.heatMapPosition.length / 1000) == 0) {
                // console.log(
                //     "position",
                //     position.x,
                //     position.y,
                //     Math.round(me.heatMapPosition.length / 1000),
                //     count2++
                // );

                heatMapPosition.push(position);
            }
        }

        heatmapData.data = heatMapPosition.map(function(item, index, array) {
            heatmapData.max = Math.max(heatmapData.max, item.value);
            // console.log(
            //     "position2",
            //     Math.round(item.x * me.width_r),
            //     Math.round(item.y * me.height_r),
            //     item.value
            // );
            return {
                x: Math.round(item.x * me.width_r),
                y: Math.round(item.y * me.height_r),
                value: item.value
            };
        });

        this.max = heatmapData.max;
        this.min = 0;
        me.heatmapCanvs.setData(heatmapData);
        this.changeAlpha(5);
    }

    changeAlpha(value: number) {
        var elements = document.getElementsByClassName("heatmap-canvas");
        for (let element of elements) {
            (element as any).style.opacity = value / 10;
        }
    }

    initMap() {
        let me = this;
        me.canvasEl = me.$refs.snapshot as any;
        me.cx = me.canvasEl.getContext("2d");
        me.image = new Image();
        me.image.src = me.mapImage.src;
        me.image.onload = () => {
            me.width_r = 600 / me.mapImage.width;
            me.height_r = 400 / me.mapImage.height;
            me.cx.drawImage(me.image, 0, 0, 600, 400);
            me.initHeatmap();
        };
    }
}
export default CameraHeatmap;
Vue.component("camera-heatmap", CameraHeatmap);
</script>



<style lang="scss" scoped>
.canvas-div {
    width: 600px;
    height: 400px;
}

.canvas-snapshot {
    position: relative;
    opacity: 1;
    width: 600px;
    height: 400px;
}

.legend-area {
    position: absolute;
    width: 220px;
    height: 90px;
    bottom: 2px;
    right: -228px;
    padding: 8px;
    background: white;
    outline: 2px solid black;
    line-height: 1em;
    z-index: 1;
}

.right {
    float: right;
}

.custom-range {
    width: 600px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
