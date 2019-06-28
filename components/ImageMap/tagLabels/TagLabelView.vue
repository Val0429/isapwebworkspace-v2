<template>
    <div
        class="tag-label-box-div"
        @drop="drop"
        @dragover="dragOver"
    >

        <tag-label-device-group
            v-for="(value, index) in imageMap.deviceGroups"
            v-if="dragType == eDragType.deviceGroupInTagLabel"
            v-on:click-edit="clickEdit"
            v-on:drag-event="dragEvent"
            :key="'tag__label__device__group__'+index"
            :deviceGroup="value"
        ></tag-label-device-group>

        <tag-label-device-mormal-camera
            v-for="(value, index) in imageMap.devices"
            v-if="dragType == eDragType.deviceInTagLabel && value.deviceType == eDeviceType.deviceNormalCamera"
            v-on:drag-event="dragEvent"
            :key="'tag__label__normal_camera'+index"
            :device="value"
        ></tag-label-device-mormal-camera>

        <tag-label-device-fisheye-camera
            v-for="(value, index) in imageMap.devices"
            v-if="dragType == eDragType.deviceInTagLabel && value.deviceType == eDeviceType.deviceFisheyeCamera"
            v-on:drag-event="dragEvent"
            :key="'tag__label__normal_camera'+index"
            :device="value"
        ></tag-label-device-fisheye-camera>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {
    ImageMapItem,
    ImageBoxItem,
    EDragType,
    ESetupMode,
    EVideoSource,
    EDeviceType,
    ISize
} from "../";
import { TagLabelDeviceGroup } from "../tagLabels/TagLabelDeviceGroup.vue";
import { TagLabelDeviceNormalCamera } from "../tagLabels/TagLabelDeviceNormalCamera.vue";
import { TagLabelDeviceFisheyeCamera } from "../tagLabels/TagLabelDeviceFisheyeCamera.vue";

@Component({
    components: {
        TagLabelDeviceGroup,
        TagLabelDeviceNormalCamera,
        TagLabelDeviceFisheyeCamera
    }
})
export class TagLabelView extends Vue {
    eDragType = EDragType;
    eDeviceType = EDeviceType;

    // prop
    @Prop({
        type: Object,
        default: new ImageMapItem()
    })
    imageMap: ImageMapItem;

    @Prop({
        type: String,
        default: EDragType.none
    })
    dragType: EDragType;

    // Vue step
    created() {}

    // init
    start() {}

    // drag & drop
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

    drop(event: any) {
        event.preventDefault();
        if (this.imageMap.setupMode != ESetupMode.setup) {
            return false;
        }
        switch (this.imageMap.dropItem.dragType) {
            case EDragType.deviceInMap:
                for (let tempObject of this.imageMap.devices) {
                    if (tempObject == this.imageMap.dropItem.data) {
                        tempObject.focus = false;
                        tempObject.dragType = EDragType.deviceInTagLabel;
                        tempObject.showPosition = {
                            x: 0,
                            y: 0
                        };
                        tempObject.dataWindow.dragType = EDragType.none;
                        tempObject.dataWindow.showPosition = {
                            x: 0,
                            y: 0
                        };
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInDevice:
                for (let tempObject of this.imageMap.devices) {
                    if (tempObject.dataWindow == this.imageMap.dropItem.data) {
                        tempObject.focus = false;
                        tempObject.dragType = EDragType.deviceInTagLabel;
                        tempObject.showPosition = {
                            x: 0,
                            y: 0
                        };
                        tempObject.dataWindow.dragType = EDragType.none;
                        tempObject.dataWindow.showPosition = {
                            x: 0,
                            y: 0
                        };
                        console.log(tempObject);
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInDeviceGroup:
                for (let tempObject of this.imageMap.deviceGroups) {
                    if (tempObject.dataWindow == this.imageMap.dropItem.data) {
                        tempObject.dragType = EDragType.deviceGroupInTagLabel;
                        tempObject.dataWindow.dragType = EDragType.none;
                        tempObject.dataWindow.showPosition = {
                            x: 0,
                            y: 0
                        };
                        break;
                    }
                }
                break;
            case EDragType.dataWindowInMap:
            case EDragType.deviceInTagLabel:
            case EDragType.deviceGroupInTagLabel:
            case EDragType.none:
            default:
                break;
        }
        this.$emit("drop", event);
    }

    // click
    clickEdit(event: any, data: any) {
        this.$emit("click-edit", event, data);
    }
}
export default TagLabelView;
Vue.component("tag-label-view", TagLabelView);
</script>

<style lang="scss" scoped>
.tag-label-box-div {
    min-height: 100px;
    padding: 10px;
}
</style>
