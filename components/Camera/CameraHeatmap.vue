<template>
    <div class="animated fadeIn">
        <div
            id="heatmap"
            class="card-content"
        >
            <!-- <div
                class="form-group col-md-12"
                style="display: flex; justify-content: center; align-items: center;"
            >
                <canvas
                    style="position:relative;"
                    ref="snapshot"
                    width="600"
                    height="350"
                ></canvas>
                <canvas
                    style="position:absolute;"
                    ref="canvas"
                    width="600"
                    height="350"
                ></canvas>
            </div> -->
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Heatmap from "heatmap.js";

@Component({})
export class CameraHeatmap extends Vue {
    //canvas
    private cxView: CanvasRenderingContext2D;
    private cx: CanvasRenderingContext2D;
    private canvasEl: HTMLCanvasElement;
    private image: HTMLImageElement;

    @Prop({
        type: Object,
        default: () => {
            return {
                name: "Name",
                snapshotBase64:
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                cameraWidth: 600,
                cameraHeight: 350
            };
        }
    })
    snapshotData: Object;

    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    canvasData: [];

    private _canvasData = [];

    mounted() {
        // 创建一个heatmap实例对象
        // 这里直接指定热点图渲染的div了.heatmap支持自定义的样式方案,网页外包接活具体可看官网api
        var heatmapInstance = Heatmap.create({
            container: document.getElementById("heatmap")
        });

        var points = [];
        var max = 0;
        var width = 600;
        var height = 400;
        var len = 200;
        while (len--) {
            var val = Math.floor(Math.random() * 100);
            max = Math.max(max, val);
            var point = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: val
            };
            points.push(point);
        }
        var data = {
            max: max,
            data: points
        };
        // 因为data是一组数据,web切图报价所以直接setData
        heatmapInstance.setData(data);
    }
}
export default CameraHeatmap;
Vue.component("camera-heatmap", CameraHeatmap);
</script>



<style lang="scss" scoped>
div {
    width: 600px;
    height: 400px;
    border: 1px solid;
    border-color: gray;
}
</style>