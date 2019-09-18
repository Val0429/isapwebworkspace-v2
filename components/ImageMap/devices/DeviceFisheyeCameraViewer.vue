<template>
    <svg
        class='device-fisheye-camera-viewer-icon'
        :style="device.viewerStyle"
    >
        <circle
            :cx="device.viewer.distance.use"
            :cy="device.viewer.distance.use"
            :r="device.viewer.distance.use"
            :fill="device.cameraViewerSVG.fill"
            :stroke="device.cameraViewerSVG.stroke"
            :stroke-width="device.cameraViewerSVG.strokeWidth"
        ></circle>
    </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, IDeviceCameraViewerSvg } from "../";

@Component({
    components: {}
})
export class DeviceFisheyeCameraViewer extends Vue {
    @Prop({
        type: Object,
        default: {}
    })
    device: any;

    created() {}

    mounted() {}
}

export default DeviceFisheyeCameraViewer;
Vue.component("device-fisheye-camera-viewer-icon", DeviceFisheyeCameraViewer);
</script>
<style lang="scss" scoped>
.device-fisheye-camera-viewer-icon {
    position: absolute;
    pointer-events: none;
}
</style>