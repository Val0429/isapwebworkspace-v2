<template>
    <div class="animated fadeIn">
        <div class="card-content">
            <div
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
            </div>
        </div>

        <div class="footer center">
            <b-button
                variant="secondary"
                size="lg"
                @click="clearROI"
            >{{ _('w_Clear') }}
            </b-button>

            <b-button
                variant="primary"
                size="lg"
                @click="saveROI"
                :disabled="isSave"
            >{{ _('w_Save') }}
            </b-button>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

interface ISnapshot {
    name;
    snapshotBase64;
    cameraWidth;
    cameraHeight;
}

interface ICanvas {
    x: number;
    y: number;
    width: number;
    height: number;
}

enum ECameraMode {
    peopleCounting = "peopleCounting",
    humanDetection = "humanDetection"
}

@Component({})
export class CameraROI extends Vue {
    isSave: boolean = false;

    //canvas
    private cxView: CanvasRenderingContext2D;
    private cx: CanvasRenderingContext2D;
    private canvasEl: HTMLCanvasElement;
    private image: HTMLImageElement;
    width_r: number = 1; // 寬比例
    height_r: number = 1; // 高比例
    model: ICanvas = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    //drop color
    color = ["#FF0000", "#00FF00", "#0000FF"];

    @Prop({
        type: Number,
        default: 3
    })
    drawRegionCount: number;

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
    snapshotData: ISnapshot;

    @Prop({
        type: Array,
        default: () => {
            return [];
        }
    })
    canvasData: ICanvas[];

    private _canvasData: ICanvas[];

    created() {}

    mounted() {
        this._canvasData = this.canvasData;
        this.initSnapshot(true);
    }

    clearModel() {
        this.model = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }

    initCanvas() {
        let me = this;
        let mouseDown: boolean = false;
        let startPoint;
        this.clearModel();

        //canvas
        var canvasEl = me.$refs.canvas as any;
        me.cxView = canvasEl.getContext("2d");
        me.cxView.lineWidth = 3;
        var viewImage = new Image();
        viewImage.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

        //先清空圖層
        me.cxView.clearRect(0, 0, 600, 350);
        viewImage.onload = () => {
            me.cxView.drawImage(viewImage, 0, 0, 600, 350);
            canvasEl.addEventListener("mousedown", onMouseDown, false);
            canvasEl.addEventListener("mouseup", onMouseUp, false);
            canvasEl.addEventListener("mousemove", onMouseMove, false);

            function onMouseDown(e) {
                mouseDown = true;
                e.stopPropagation();

                me.cxView.strokeStyle = me.drawColor(me._canvasData.length);
                startPoint = {
                    x: e.offsetX || e.originalEvent.layerX,
                    y: e.offsetY || e.originalEvent.layerY
                };
            }
            function onMouseUp(e) {
                mouseDown = false;
                e.stopPropagation();
                if (me._canvasData.length >= me.drawRegionCount) return;
                me._canvasData.push(JSON.parse(JSON.stringify(me.model)));
                me.initSnapshot(false);
            }
            function onMouseMove(e) {
                e.stopPropagation();

                if (!mouseDown) return;
                if (me._canvasData.length >= me.drawRegionCount) return;
                var cursor = {
                    x: e.offsetX || e.originalEvent.layerX,
                    y: e.offsetY || e.originalEvent.layerY
                };

                me.cxView.lineWidth = 3;
                let x = startPoint.x;
                if (cursor.x < startPoint.x) x = cursor.x;
                let y = startPoint.y;
                if (cursor.y < startPoint.y) y = cursor.y;
                let w = Math.abs(cursor.x - startPoint.x);
                let h = Math.abs(cursor.y - startPoint.y);
                me.cxView.clearRect(0, 0, 600, 350); //清除路徑
                me.cxView.strokeRect(x, y, w, h);

                me.model.x = Math.round(x * me.width_r);
                me.model.y = Math.round(y * me.height_r);
                me.model.width = Math.round(w * me.width_r);
                me.model.height = Math.round(h * me.height_r);
            }
        };
    }

    initSnapshot(isinitCanvas) {
        let me = this;
        me.canvasEl = me.$refs.snapshot as any;
        me.cx = me.canvasEl.getContext("2d");

        me.cx.lineWidth = 3;
        me.image = new Image();
        me.image.src = me.snapshotData.snapshotBase64;

        me.image.onload = () => {
            me.width_r = me.snapshotData.cameraWidth / 600;
            me.height_r = me.snapshotData.cameraHeight / 350;
            me.cx.drawImage(me.image, 0, 0, 600, 350);

            for (let item of me._canvasData) {
                me.cx.strokeStyle = me.drawColor(me._canvasData.indexOf(item));

                var start_x = Math.round(item.x / me.width_r);
                var start_y = Math.round(item.y / me.height_r);
                var start_width = Math.round(item.width / me.width_r);
                var start_height = Math.round(item.height / me.height_r);

                me.cx.beginPath();
                me.cx.rect(start_x, start_y, start_width, start_height);
                me.cx.stroke();
            }

            if (isinitCanvas) {
                this.initCanvas();
            }
        };
    }

    drawColor(item) {
        switch (item) {
            case 0: // red
            case 1: // green
            case 2: // blue
                break;
            default:
                this.color.push(this.getRandomColor());
        }
        return this.color[item];
    }

    getRandomColor() {
        var color = "";
        for (var i = 0; i < 3; i++) {
            var sub = Math.floor(Math.random() * 256).toString(16);
            color += sub.length == 1 ? "0" + sub : sub;
        }
        return "#" + color;
    }

    saveROI() {
        this.$emit("save-roi", this._canvasData);
    }

    clearROI() {
        this._canvasData = []; //請空畫線
        this.isSave = false;
        this.cxView.clearRect(0, 0, 600, 350); //清除
        this.initSnapshot(false); //更新圖片
        this.$emit("clear-roi", this._canvasData);
    }

    pageToBack() {
        this.$emit("page-to-back");
    }
}

export default CameraROI;
Vue.component("camera-roi", CameraROI);
</script>



<style lang="scss" scoped>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>