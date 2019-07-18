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
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IHeatMapData, IHeatMapPosition, IMapImage } from "./IHeatmap";
import Heatmap from "heatmap.js";

@Component({})
export class CameraHeatmap extends Vue {
    //canvas
    private cx: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private canvasEl: HTMLCanvasElement;
    private heatmapCanvs: any;

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

    private _width_r: number = 1; // 寬比例
    private _height_r: number = 1; // 高比例

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
                x: item.x * me._width_r,
                y: item.y * me._height_r,
                value: item.value
            };
        });

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
            me._width_r = me.mapImage.width / me.image.width;
            me._height_r = me.mapImage.height / me.image.height;
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
</style>