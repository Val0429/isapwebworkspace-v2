<template>
    <div ref="mapParent">

        <!-- map區域 -->
        <div
            class="map-view"
            :style="{ height: imageMap.imageBox.showSize.height +'px'}"
            @drop="drop"
            @dragover="dragOver"
        >
            <!-- image -->
            <img
                class="map-image"
                :src="imageMap.imageBox.src"
                :style="{width: imageMap.imageBox.showSize.width+'px', height: imageMap.imageBox.showSize.height+'px'}"
            >

            <!-- ============================================= -->

            <!-- viewer -->
            <device-normal-camera-viewer
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.viewerInDevice && value.dragType == eDragType.deviceInMap && value.deviceType == eDeviceType.deviceNormalCamera"
                :key="'device__normal__camera__viewer__' + index"
                :device="value"
            >
            </device-normal-camera-viewer>

            <device-fisheye-camera-viewer
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.viewerInDevice && value.dragType == eDragType.deviceInMap && value.deviceType == eDeviceType.deviceFisheyeCamera"
                :key="'device__fisheye__camera__viewer__' + index"
                :device="value"
            >
            </device-fisheye-camera-viewer>
            <!-- viewer -->

            <!-- ============================================= -->

            <!-- device name label -->
            <device-name-label
                ref="deviceNamelabel"
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.nameInDevice && value.dragType == eDragType.deviceInMap"
                :key="'device__normal__camera__name__label__' + index"
                :device="value"
            ></device-name-label>
            <!-- device name label -->

            <!-- ============================================= -->

            <!-- device camera -->
            <device-normal-camera
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.deviceInMap && value.dragType == eDragType.deviceInMap && value.deviceType == eDeviceType.deviceNormalCamera"
                v-on:drag-event="dragEvent"
                v-on:click-device="clickDevice"
                :key="'device__normal__camera__' + index"
                :device="value"
            ></device-normal-camera>

            <device-fisheye-camera
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.deviceInMap && value.dragType == eDragType.deviceInMap && value.deviceType == eDeviceType.deviceFisheyeCamera"
                v-on:drag-event="dragEvent"
                v-on:click-device="clickDevice"
                :key="'device__fisheye__camera__' + index"
                :device="value"
            ></device-fisheye-camera>
            <!-- device camera -->

            <!-- ============================================= -->

            <!-- data window in map -->
            <data-window-license-plate-recognition
                v-for="(value, index) in imageMap.imageBox.dataWindows"
                v-if="imageMap.draw.dataWindowInMap && value.videoSource == eVideoSource.licensePlateRecognition"
                v-on:drag-event="dragEvent"
                :key="'data__window__license__plate__recognition__map__' + index"
                :dataWindow="value"
            >
            </data-window-license-plate-recognition>

            <data-window-occupancy
                v-for="(value, index) in imageMap.imageBox.dataWindows"
                v-if="imageMap.draw.dataWindowInMap && value.videoSource == eVideoSource.occupancy"
                v-on:drag-event="dragEvent"
                :key="'data__window__occupancy__map__' + index"
                :dataWindow="value"
            >
            </data-window-occupancy>

            <data-window-people-counting
                v-for="(value, index) in imageMap.imageBox.dataWindows"
                v-if="imageMap.draw.dataWindowInMap && value.videoSource == eVideoSource.peopleCounting"
                v-on:drag-event="dragEvent"
                :key="'data__window__people__counting__map__' + index"
                :dataWindow="value"
            >
            </data-window-people-counting>
            <!-- data window in map -->

            <!-- ============================================= -->

            <!-- data window in device group -->
            <data-window-license-plate-recognition
                v-for="(value, index) in imageMap.deviceGroups"
                v-if="imageMap.draw.dataWindowInDeviceGroup && value.dataWindow.dragType == eDragType.dataWindowInDeviceGroup && value.dataWindow.videoSource == eVideoSource.licensePlateRecognition"
                v-on:drag-event="dragEvent"
                :key="'data__window__license__plate__recognition__device__group__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-license-plate-recognition>

            <data-window-occupancy
                v-for="(value, index) in imageMap.deviceGroups"
                v-if="imageMap.draw.dataWindowInDeviceGroup && value.dataWindow.dragType == eDragType.dataWindowInDeviceGroup && value.videoSource == eVideoSource.occupancy"
                v-on:drag-event="dragEvent"
                :key="'data__window__occupancy__device__group__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-occupancy>

            <data-window-people-counting
                v-for="(value, index) in imageMap.deviceGroups"
                v-if="imageMap.draw.dataWindowInDeviceGroup && value.dataWindow.dragType == eDragType.dataWindowInDeviceGroup && value.videoSource == eVideoSource.peopleCounting"
                v-on:drag-event="dragEvent"
                :key="'data__window__people__counting__device__group__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-people-counting>
            <!-- data window in device group -->

            <!-- ============================================= -->

            <!-- data window in device -->
            <data-window-license-plate-recognition
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.dataWindowInDevice && value.dragType == eDragType.deviceInMap && value.dataWindow.dragType == eDragType.dataWindowInDevice && value.videoSource == eVideoSource.licensePlateRecognition"
                v-on:drag-event="dragEvent"
                :key="'data__window__license__plate__recognition__device__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-license-plate-recognition>

            <data-window-occupancy
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.dataWindowInDevice && value.dragType == eDragType.deviceInMap && value.dataWindow.dragType == eDragType.dataWindowInDevice && value.videoSource == eVideoSource.occupancy"
                v-on:drag-event="dragEvent"
                :key="'data__window__occupancy__device__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-occupancy>

            <data-window-people-counting
                v-for="(value, index) in imageMap.devices"
                v-if="imageMap.draw.dataWindowInDevice && value.dragType == eDragType.deviceInMap && value.dataWindow.dragType == eDragType.dataWindowInDevice && value.videoSource == eVideoSource.peopleCounting"
                v-on:drag-event="dragEvent"
                :key="'data__window__people__counting__device__' + index"
                :dataWindow="value.dataWindow"
            >
            </data-window-people-counting>
            <!-- data window in device -->

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

// dataWindow
import { DataWindowLicensePlateRecognition } from "@/components/ImageMap/dataWindows/DataWindowLicensePlateRecognition.vue";
import { DataWindowOccupancy } from "@/components/ImageMap/dataWindows/DataWindowOccupancy.vue";
import { DataWindowPeopleCounting } from "@/components/ImageMap/dataWindows/DataWindowPeopleCounting.vue";

// device normal camera
import { DeviceNormalCamera } from "@/components/ImageMap/devices/DeviceNormalCamera.vue";
import { DeviceNameLabel } from "@/components/ImageMap/devices/DeviceNameLabel.vue";
import { DeviceNormalCameraViewer } from "@/components/ImageMap/devices/DeviceNormalCameraViewer.vue";

// device fisheye camera
import { DeviceFisheyeCamera } from "@/components/ImageMap/devices/DeviceFisheyeCamera.vue";
import { DeviceFisheyeCameraViewer } from "@/components/ImageMap/devices/DeviceFisheyeCameraViewer.vue";

import {
    EDragType,
    ESetupMode,
    EVideoSource,
    EDeviceType,
    ISize,
    IPosition,
    IScale,
    ImageMapItem,
    ImageBoxItem,
    DeviceNormalCameraItem,
    DataWindowOccupancyItem,
    DataWindowPeopleCountingItem
} from "./";
import IconBase64 from "./models/IconBase64";

@Component({
    components: {
        // dataWindow
        DataWindowPeopleCounting,
        DataWindowOccupancy,
        DataWindowLicensePlateRecognition,

        // device name label
        DeviceNameLabel,

        // device normal camera
        DeviceNormalCamera,
        DeviceNormalCameraViewer,

        // device fisheye camera
        DeviceFisheyeCamera,
        DeviceFisheyeCameraViewer
    }
})
export class ImageBox extends Vue {
    @Prop({
        type: Object,
        default: new ImageMapItem()
    })
    imageMap: ImageMapItem;

    // class let
    eSetupMode = ESetupMode;
    eDragType = EDragType;
    eVideoSource = EVideoSource;
    eDeviceType = EDeviceType;

    imageMapMarginLeft: number = 15;
    widthControlTimes = 0;

    imageScale: IScale = {
        horizontal: 1,
        vertical: 1
    };

    created() {}

    mounted() {
        this.start();
    }

    start() {
        let mapParentRef: any = this.$refs.mapParent;
        if (mapParentRef.clientWidth <= 0 && this.widthControlTimes < 100) {
            this.widthControlTimes++;
            setTimeout(this.start, 100);
            return false;
        }
        this.widthControlTimes = 0;
        this.imageMap.imageBox.showSizeWidth = mapParentRef.clientWidth;
        this.imageMap.dropItem.size.width = mapParentRef.clientWidth;
        this.imageMap.dropItem.size.height = this.imageMap.imageBox.showSize.height;
        this.imageMap.dropItem.left = this.imageMapMarginLeft;

        // update scale
        this.imageScale = {
            horizontal: this.imageMap.imageBox.positionScale.horizontal,
            vertical: this.imageMap.imageBox.positionScale.vertical
        };

        this.initDevices();
        this.initDataWindows();
    }

    initDevices() {
        // update devices
        for (let device of this.imageMap.devices) {
            device.positionScale = this.imageScale;

            // check device position
            let newPosition: IPosition = JSON.parse(
                JSON.stringify(device.showPosition)
            );
            if (newPosition.x > this.imageMap.imageBox.showSize.width) {
                newPosition.x = this.imageMap.imageBox.center.x;
            }
            if (newPosition.y > this.imageMap.imageBox.showSize.height) {
                newPosition.y = this.imageMap.imageBox.center.y;
            }
            device.showPosition = newPosition;
        }
    }

    initDataWindows() {
        // update dataWindow in map
        for (let dataWindow of this.imageMap.imageBox.dataWindows) {
            dataWindow.positionScale = this.imageScale;
        }

        // update dataWindow in device group
        for (let deviceGroup of this.imageMap.deviceGroups) {
            deviceGroup.dataWindow.positionScale = this.imageScale;
        }

        // update dataWindow in devices
        for (let device of this.imageMap.devices) {
            device.dataWindow.positionScale = this.imageScale;
        }
    }

    // click function
    clickDevice(event: any, data: any) {
        this.$emit("click-device", event, data);
    }

    // drop & drag
    drop(event: any) {
        event.preventDefault();
        if (this.imageMap.setupMode != ESetupMode.setup) {
            return false;
        }
        let deviceNameLabelRefs: any = this.$refs.deviceNamelabel;
        let left = event.layerX - this.imageMap.dropItem.mousePosition.x;
        let top = event.layerY - this.imageMap.dropItem.mousePosition.y;

        switch (this.imageMap.dropItem.dragType) {
            case EDragType.deviceInMap:
                for (let tempObject of this.imageMap.devices) {
                    if (tempObject == this.imageMap.dropItem.data) {
                        tempObject.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInMap:
                for (let tempObject of this.imageMap.imageBox.dataWindows) {
                    if (tempObject == this.imageMap.dropItem.data) {
                        tempObject.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInDeviceGroup:
                for (let tempObject of this.imageMap.deviceGroups) {
                    if (tempObject.dataWindow == this.imageMap.dropItem.data) {
                        tempObject.dataWindow.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInDevice:
                for (let tempObject of this.imageMap.devices) {
                    if (tempObject.dataWindow == this.imageMap.dropItem.data) {
                        tempObject.dataWindow.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.deviceInTagLabel:
                for (let tempObject of this.imageMap.devices) {
                    if (tempObject == this.imageMap.dropItem.data) {
                        tempObject.dragType = EDragType.deviceInMap;
                        tempObject.showPosition = {
                            x: left,
                            y: top
                        };
                        tempObject.dataWindow.dragType =
                            EDragType.dataWindowInDevice;
                        tempObject.dataWindow.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.deviceGroupInTagLabel:
                for (let tempObject of this.imageMap.deviceGroups) {
                    if (tempObject == this.imageMap.dropItem.data) {
                        tempObject.dragType = EDragType.dataWindowInDeviceGroup;
                        tempObject.dataWindow.dragType =
                            EDragType.dataWindowInDeviceGroup;
                        tempObject.dataWindow.showPosition = {
                            x: left,
                            y: top
                        };
                        break;
                    }
                }
                break;
            case EDragType.none:
            default:
                break;
        }
        for (let deviceNameLabelRef of deviceNameLabelRefs) {
            if (deviceNameLabelRef != undefined) {
                deviceNameLabelRef.initNameLabel();
            }
        }
        this.$emit("drop", event);
    }

    dragEvent(event: any, dragType: string, data: any) {
        if (this.imageMap.setupMode != ESetupMode.setup) {
            return false;
        }
        this.imageMap.dropItem.dragType = dragType;
        this.imageMap.dropItem.mousePosition.x = event.offsetX;
        this.imageMap.dropItem.mousePosition.y = event.offsetY;
        this.imageMap.dropItem.data = data;
        this.$emit("drag-event", event, this.imageMap.dropItem.data);
    }

    dragOver(event: any) {
        event.preventDefault();
    }
}

export default ImageBox;
Vue.component("image-box", ImageBox);
</script>

<style lang="scss" scoped>
.drop-view {
    position: absolute;
    padding: 0;
    left: 0;
    top: 0;
    z-index: -1;
}

.map-view {
    position: relative;
    padding: 0;
    left: 0;
    top: 0;
    overflow: hidden;

    .map-image {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
