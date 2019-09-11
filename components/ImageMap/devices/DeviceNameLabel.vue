<template>
    <div
        ref="deviceNameLabel"
        class="device-name-label"
        :style="device.nameLabelStyle"
    >{{ device.name }}</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, EVideoSource, EDeviceType, IScale, DeviceItem } from "../";
@Component({
    components: {}
})
export class DeviceNameLabel extends Vue {
    // 相機名稱位置
    private nameLabelPositionOffset: IScale = {
        horizontal: 0,
        vertical: 10
    };

    @Prop({
        type: Object,
        default: new DeviceItem(
            "",
            EDragType.none,
            EVideoSource.none,
            EDeviceType.none
        )
    })
    device: any;

    created() {}

    mounted() {
        this.initNameLabel();
    }

    initNameLabel() {
        let deviceNameLabelRef: any = this.$refs.deviceNameLabel;
        if (deviceNameLabelRef != undefined) {
            let left =
                this.device.center.x - deviceNameLabelRef.clientWidth / 2;
            let top =
                this.device.showPosition.y +
                this.device.size.height +
                this.nameLabelPositionOffset.vertical;

            this.device.nameLabelStyle = "";
            this.device.nameLabelStyle += `left: ${left}px;`;
            this.device.nameLabelStyle += `top: ${top}px;`;
        }
    }
}
export default DeviceNameLabel;
Vue.component("device-name-label", DeviceNameLabel);
</script>

<style lang="scss" scoped>
.device-name-label {
    position: absolute;
    padding: 5px 10px;
    background-color: rgb(70, 82, 91);
    color: #fff;
    pointer-events: none;
}
</style>