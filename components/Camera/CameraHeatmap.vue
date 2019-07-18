<template>
    <div class="animated fadeIn">
        <div class="card-content">
            <div
                class="form-group col-md-12"
                style="display: flex; justify-content: center; align-items: center;"
            >
                <div
                    class="canvas-div"
                    style="position:absolute;"
                    ref="heatmap"
                >
                    <canvas
                        style="position:relative; opacity:1.0;"
                        ref="snapshot"
                        width="600"
                        height="400"
                    ></canvas>
                    <div class="legend-area">
                        <h5>Heatmap Legend</h5>
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

    private max: number = 0;
    private min: number = 0;
    private width_r: number = 1; // 寬比例
    private height_r: number = 1; // 高比例

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

    created() {}

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
                x: item.x * me.width_r,
                y: item.y * me.height_r,
                value: item.value
            };
        });

        this.max = heatmapData.max;
        this.min = 0;
        me.heatmapCanvs.setData(heatmapData);
        console.log("initHeatmap", me.heatmapCanvs, heatmapData);
    }

    initMap() {
        let me = this;
        me.canvasEl = me.$refs.snapshot as any;
        me.cx = me.canvasEl.getContext("2d");
        me.image = new Image();
        me.image.src = me.mapImage.src;

        me.image.onload = () => {
            console.log("initMap", me.image.width, me.image.height);
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
    width: 600;
    height: 400;
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
</style>