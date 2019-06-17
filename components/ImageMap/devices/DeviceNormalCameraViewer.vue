<template>
    <svg
        class='device-normal-camera-viewer-icon'
        :style="device.viewerStyle"
    >
        <path
            :d="device.viewerPath"
            :fill="device.cameraViewerSVG.fill"
            :stroke="device.cameraViewerSVG.stroke"
            :stroke-width="device.cameraViewerSVG.strokeWidth"
        ></path>
        />
    </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, IDeviceCameraViewerSvg } from "../models";

@Component({
    components: {}
})
export class DeviceNormalCameraViewer extends Vue {
    @Prop({
        type: Object,
        default: {}
    })
    device: any;

    created() {}

    mounted() {}
}

export default DeviceNormalCameraViewer;
Vue.component("device-normal-camera-viewer-icon", DeviceNormalCameraViewer);
</script>
<style lang="scss" scoped>
.device-normal-camera-viewer-icon {
    position: absolute;
    pointer-events: none;
}
</style>