<template>

    <div
        ref="cameraDetail"
        class='tag-label-camera'
        :class="{'drag': device.dragType == eDragType.deviceInTagLabel, 'focus': device.focus}"
        :draggable="device.dragType == eDragType.deviceInTagLabel"
        @dragstart="dragstart"
        @click="clickStart"
    >
        <i
            class="fa fa-video-camera pr-2"
            aria-hidden="true"
        ></i>
        {{ device.name}}

        <toolbox-sliders
            v-show="device.dragType != eDragType.deviceInTagLabel"
            class="float-right card-collapse-button"
            @click="showSliders($event)"
        />

        <!-- 使相機的滑動軌道一樣長 -->
        <div style="height: 6px"></div>

        <div v-show="device.focus">
            <b-form-group
                :label="_('w_Camera_Angle')"
                :label-cols="3"
            >
                <b-form-input
                    type="range"
                    class="mt-2"
                    max="359"
                    min="0"
                    v-model="device.rotate"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                :label="_('w_Camera_Breadth')"
                :label-cols="3"
            >
                <b-form-input
                    type="range"
                    class="mt-2"
                    v-model="device.viewerAngle"
                    :max="device.viewer.angle.max.toString()"
                    :min="device.viewer.angle.min.toString()"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                :label="_('w_Camera_Distance')"
                :label-cols="3"
            >
                <b-form-input
                    type="range"
                    class="mt-2"
                    v-model="device.viewerDistance"
                    :max="device.viewer.distance.max.toString()"
                    :min="device.viewer.distance.min.toString()"
                ></b-form-input>
            </b-form-group>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {
    EDragType,
    EVideoSource,
    EDeviceType,
    ImageMapItem,
    ImageBoxItem,
    DeviceNormalCameraItem
} from "../models";

@Component({
    components: {}
})
export class TagLabelDeviceNormalCamera extends Vue {
    eDragType = EDragType;

    @Prop({
        type: Object,
        default: new DeviceNormalCameraItem(
            "",
            EDragType.none,
            EVideoSource.none
        )
    })
    device: DeviceNormalCameraItem;

    created() {}

    mounted() {}

    dragstart(event: any) {
        this.$emit("drag-event", event, this.device.dragType, this.device);
    }

    clickStart(event: any) {
        this.$emit("click-edit", event, this.device);
    }

    showSliders(e) {
        if (this.device.dragType != EDragType.deviceInTagLabel) {
            this.device.focus = !this.device.focus;
        }
    }
}

export default TagLabelDeviceNormalCamera;
Vue.component("tag-label-device-mormal-camera", TagLabelDeviceNormalCamera);
</script>

<style lang="scss" scoped>
.tag-label-camera {
    margin: 10px 0;
    padding: 10px;
    color: #fff;
    background-color: #0291ff;

    &.drag {
        background-color: #fff;
        border: solid 1px rgb(201, 201, 201);
        color: rgb(201, 201, 201);
    }

    &.focus {
        background-color: #024376;
    }

    // 去除系統默認的樣式
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }

    // 給滑動軌道(track)添加樣式
    input[type="range"]::-webkit-slider-runnable-track {
        height: 5px;
        background: #fff;
        /*border-radius: 10px; !*將軌道設為圓角的*!*/
        /*box-shadow: 0 1px 1px #def3f8, inset 0 .125em .125em #0d1112; !*軌道內置陰影效果*!*/
    }

    // 給滑塊(thumb)添加樣式
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        margin-top: -5px; /*使滑塊超出軌道部分的偏移量相等*/
        background: #ffffff;
        border-radius: 50%; /*外觀設置為圓形*/
    }
}
</style>
