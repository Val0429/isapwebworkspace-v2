<template>
    <img
        class="fisheye-camera-icon"
        draggable="true"
        :style="device.cameraStyle"
        :src="device.focus ? device.focusSrc : device.src"
        :class="{
            event : device.event,
            'no-drop': device.pointerEventNone
        }"
        @dragstart="dragstart"
        @click="clickStart"
    >
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, DeviceFisheyeCameraItem, EVideoSource } from "../";

@Component({
    components: {}
})
export class DeviceFisheyeCamera extends Vue {
    @Prop({
        type: Object,
        default: new DeviceFisheyeCameraItem(
            "",
            EDragType.none,
            EVideoSource.none
        )
    })
    device: DeviceFisheyeCameraItem;

    created() {}

    mounted() {}

    dragstart(event: any) {
        this.$emit("drag-event", event, this.device.dragType, this.device);
    }

    clickStart(event: any) {
        this.$emit("click-device", event, this.device);
    }
}
export default DeviceFisheyeCamera;
Vue.component("device-fisheye-camera", DeviceFisheyeCamera);
</script>

<style lang="scss" scoped>
@keyframes pulse {
    0% {
        box-shadow: 0 0 8px 6px #eaeaea;
    }
    50% {
        box-shadow: 0 0 8px 6px #ff6633;
    }
    100% {
        box-shadow: 0 0 8px 6px #eaeaea;
    }
}

.fisheye-camera-icon {
    position: absolute;
    pointer-events: auto;

    &.no-drop {
        pointer-events: none;
    }

    &.event {
        border: 0;
        animation: show-animation 2s ease-in-out 0s infinite;
        -moz-animation: show-animation 2s ease-in-out 0s infinite; /*適配火狐瀏覽器*/
        -webkit-animation: show-animation 2s ease-in-out 0s infinite; /*適配谷歌和Safari*/
        animation: pulse 5s infinite;
    }
}
</style>