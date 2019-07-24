<template>
    <div class="animated fadeIn">
        <div class="card-content">
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
                        <h5>{{legendTitle}}</h5>
                        <span class="left">{{min}}</span>
                        <span class="right">{{max}}</span>
                        <img
                            id="gradient"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAKCAYAAABCHPt+AAAAnklEQVRYR+2WQQqDQBAES5wB/f8/Y05RcMWwSu6JIT0Dm4WlH1DUdHew7/z6WYFhhnGRpnlhAEaQpi/ADbh/np0MiBhGhW+2ymFU+DZfg1EhaoB4jCFuMYYcQKZrXwPEVvm5Og0pcYakBvI35G1jNIZ4jCHexxjSpz9ZFUjAynLbpOvqteaODkm9sloz5JF+ZTVmSAWSu9Qb65AvgDwBQoLgVDlWfAQAAAAASUVORK5CYII="
                            style="width:100%"
                        >
                    </div>
                </div>
            </div>
            <div class="center">
                <b-form-input
                    @mousemove="changeAlpha(alpha)"
                    v-model="alpha"
                    type="range"
                    min="0"
                    max="10"
                ></b-form-input>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { IHeatMapData, IHeatMapPosition, IMapImage } from "./IHeatmap";
import Heatmap from "heatmap.js";
import VueSlideBar from "vue-slide-bar";

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
    private watchPageType(newVal, oldVal) {
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

        me.heatmapCanvs = Heatmap.create({
            container: me.$refs.heatmap as any
        });

        heatmapData.data = me.heatMapPosition.map(function(item, index, array) {
            heatmapData.max = Math.max(heatmapData.max, item.value);
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
            me.width_r = me.mapImage.width / me.image.width;
            me.height_r = me.mapImage.height / me.image.height;
            me.cx.drawImage(
                me.image,
                0,
                0,
                me.mapImage.width,
                me.mapImage.height
            );
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
    bottom: 0;
    right: 0;
    padding: 10px;
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