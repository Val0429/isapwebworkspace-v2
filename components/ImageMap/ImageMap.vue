<template>
    <div>
        <b-row>
            <b-col
                v-if="imageMap.setupMode == eSetupMode.setup"
                cols="3"
            >

                <!-- device group -->
                <div
                    class="tag-label-view"
                    v-if="imageMap.draw.deviceGroupInTagLabel"
                >
                    <div class="tag-label-title-view">
                        <div>{{ _('w_ImageMap_DeviceGroupTagLabelTitle') }}</div>
                        <div>
                            <template>
                                <iv-toolbox-add
                                    class="button-add"
                                    @click="clickAddTagLabel"
                                />
                            </template>
                        </div>
                    </div>

                    <tag-label-view
                        ref="deviceGroupTabLabelView"
                        v-on:drop="drop"
                        v-on:click-edit="clickEditTagLabel"
                        v-on:drag-event="dragEvent"
                        :imageMap="imageMap"
                        :dragType="eDragType.deviceGroupInTagLabel"
                    ></tag-label-view>

                </div>

                <!-- device -->
                <div
                    class="tag-label-view"
                    v-if="imageMap.draw.deviceInTagLabel"
                >
                    <div class="tag-label-title-view">
                        {{ _('w_ImageMap_DeviceTagLabelTitle') }}
                    </div>

                    <tag-label-view
                        ref="deviceTabLabelView"
                        v-on:drop="drop"
                        v-on:click-edit="clickEditTagLabel"
                        v-on:drag-event="dragEvent"
                        :imageMap="imageMap"
                        :dragType="eDragType.deviceInTagLabel"
                    >
                    </tag-label-view>
                </div>

            </b-col>
            <b-col :cols="imageMap.setupMode == eSetupMode.setup ? '9' : '12'">
                <image-box
                    ref="imageBox"
                    v-on:drop="drop"
                    v-on:click-device="clickDevice"
                    v-on:drag-event="dragEvent"
                    :imageMap="imageMap"
                >
                </image-box>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, ImageMapItem, ESetupMode } from "./models";
import { ImageBox } from "./ImageBox.vue";
import { TagLabelView } from "./tagLabels/TagLabelView.vue";

@Component({
    components: {
        ImageBox,
        TagLabelView
    }
})
export class ImageMap extends Vue {
    eSetupMode = ESetupMode;
    eDragType = EDragType;

    // prop
    @Prop({
        type: Object,
        default: new ImageMapItem()
    })
    imageMap: ImageMapItem;

    // Vue step
    created() {}

    mounted() {
        this.start();
        const self = this;
        window.onresize = function(event) {
            if (self.start != undefined) {
                self.start();
            }
        };
    }

    beforeDestroy() {
        window.onresize = null;
    }

    // init
    start() {
        let imageBoxRef: any = this.$refs.imageBox;
        let deviceGroupTabLabelViewRef: any = this.$refs
            .deviceGroupTabLabelView;
        let deviceTabLabelViewRef: any = this.$refs.deviceTabLabelView;

        // reset children Setting mode
        this.imageMap.resetSetupMode();

        // init children
        if (imageBoxRef != undefined) {
            setTimeout(imageBoxRef.start, 100);
        }
        if (deviceGroupTabLabelViewRef != undefined) {
            setTimeout(deviceGroupTabLabelViewRef.start, 100);
        }
        if (deviceTabLabelViewRef != undefined) {
            setTimeout(deviceTabLabelViewRef.start, 100);
        }
    }

    // emit function
    clickAddTagLabel() {
        this.$emit("click-add-tag-label");
    }

    clickEditTagLabel(event: any, data: any) {
        this.$emit("click-edit-tag-label", event, data);
    }

    clickDevice(evetn: any, data: any) {
        this.$emit("click-device", event, data);
    }

    // inside function
    drop(event: any) {
        this.imageMap.dropItem.dragType = "";
        this.imageMap.dropItem.mousePosition = { x: 0, y: 0 };
        this.imageMap.dropItem.data = JSON.parse(
            JSON.stringify(this.imageMap.dropItem.data)
        );
        this.imageMap.dropItem.data = {};
        for (let dataWindow of this.imageMap.imageBox.dataWindows) {
            dataWindow.pointerEventNone = false;
        }
        for (let deviceGroup of this.imageMap.deviceGroups) {
            deviceGroup.dataWindow.pointerEventNone = false;
        }
        for (let device of this.imageMap.devices) {
            device.pointerEventNone = false;
            device.dataWindow.pointerEventNone = false;
        }
        this.$emit("drop", event);
    }

    dragEvent(event, data) {
        switch (this.imageMap.dropItem.dragType) {
            case EDragType.deviceInMap:
                for (let dataWindow of this.imageMap.imageBox.dataWindows) {
                    dataWindow.pointerEventNone = true;
                }
                for (let deviceGroup of this.imageMap.deviceGroups) {
                    deviceGroup.dataWindow.pointerEventNone = true;
                }
                for (let device of this.imageMap.devices) {
                    if (device == this.imageMap.dropItem.data) {
                        device.dataWindow.pointerEventNone = true;
                        continue;
                    }
                    device.pointerEventNone = true;
                    device.dataWindow.pointerEventNone = true;
                }
                break;
            case EDragType.dataWindowInMap:
                for (let dataWindow of this.imageMap.imageBox.dataWindows) {
                    if (dataWindow == this.imageMap.dropItem.data) {
                        continue;
                    }
                    dataWindow.pointerEventNone = true;
                }
                for (let deviceGroup of this.imageMap.deviceGroups) {
                    deviceGroup.dataWindow.pointerEventNone = true;
                }
                for (let device of this.imageMap.devices) {
                    device.pointerEventNone = true;
                    device.dataWindow.pointerEventNone = true;
                }
                break;
            case EDragType.dataWindowInDeviceGroup:
                for (let dataWindow of this.imageMap.imageBox.dataWindows) {
                    dataWindow.pointerEventNone = true;
                }
                for (let deviceGroup of this.imageMap.deviceGroups) {
                    if (deviceGroup.dataWindow == this.imageMap.dropItem.data) {
                        continue;
                    }
                    deviceGroup.dataWindow.pointerEventNone = true;
                }
                for (let device of this.imageMap.devices) {
                    if (device == this.imageMap.dropItem.data) {
                        device.dataWindow.pointerEventNone = true;
                        continue;
                    }
                    device.pointerEventNone = true;
                }
                break;
            case EDragType.dataWindowInDevice:
                for (let dataWindow of this.imageMap.imageBox.dataWindows) {
                    dataWindow.pointerEventNone = true;
                }
                for (let deviceGroup of this.imageMap.deviceGroups) {
                    if (deviceGroup == this.imageMap.dropItem.data) {
                        continue;
                    }
                    deviceGroup.dataWindow.pointerEventNone = true;
                }
                for (let device of this.imageMap.devices) {
                    if (device.dataWindow == this.imageMap.dropItem.data) {
                        device.pointerEventNone = true;
                        continue;
                    }
                    device.pointerEventNone = true;
                    device.dataWindow.pointerEventNone = true;
                }
                break;
            case EDragType.deviceInTagLabel:
            case EDragType.deviceGroupInTagLabel:
            case EDragType.none:
            default:
                for (let dataWindow of this.imageMap.imageBox.dataWindows) {
                    dataWindow.pointerEventNone = true;
                }
                for (let deviceGroup of this.imageMap.deviceGroups) {
                    deviceGroup.dataWindow.pointerEventNone = true;
                }
                for (let device of this.imageMap.devices) {
                    device.dataWindow.pointerEventNone = true;
                    device.pointerEventNone = true;
                }
                break;
        }
    }
}

export default ImageMap;
Vue.component("image-map", ImageMap);
</script>

<style lang="scss" scoped>
.tag-label-view {
    margin-bottom: 30px;

    .tag-label-title-view {
        line-height: 35px;
        font-weight: bold;
        display: flex;
        padding: 2px;
        margin-left: 14px;
        margin-right: 5px;
        font-size: 14px;

        .button-add {
            font-size: 20px;
            position: absolute;
            right: 30px;
        }
    }
}
</style>
