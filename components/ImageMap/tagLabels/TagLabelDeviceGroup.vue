<template>

    <div>
        <div
            class='tag-label'
            :class="{'drag': deviceGroup.dragType == eDragType.deviceGroupInTagLabel}"
            :draggable="deviceGroup.dragType == eDragType.deviceGroupInTagLabel"
            @dragstart="dragstart"
        >
            <i
                class="fa fa-map-marker pr-2"
                aria-hidden="true"
            ></i>
            {{ deviceGroup.name}}

            <!-- bar2.0 此功能移至其他頁面新刪修 -->
            <!-- <iv-toolbox-edit
                class="float-right"
                @click="clickEdit"
            /> -->

        </div>
    </div>

</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, DeviceGroupItem, EVideoSource } from "../";

@Component({
    components: {}
})
export class TagLabelDeviceGroup extends Vue {
    @Prop({
        type: Object,
        default: new DeviceGroupItem("", EDragType.none, EVideoSource.none)
    })
    deviceGroup: DeviceGroupItem;

    eDragType = EDragType;

    created() {}

    mounted() {}

    dragstart(event: any) {
        this.$emit(
            "drag-event",
            event,
            this.deviceGroup.dragType,
            this.deviceGroup
        );
    }

    clickEdit(event: any) {
        this.$emit("click-edit", event, this.deviceGroup);
    }
}

export default TagLabelDeviceGroup;
Vue.component("tag-label-device-group", TagLabelDeviceGroup);
</script>

<style lang="scss" scoped>
.tag-label {
    margin: 10px 0;
    padding: 10px;
    background-color: #ffa556;
    color: #fff;

    &.drag {
        background-color: #fff;
        border: solid 1px rgb(201, 201, 201);
        color: rgb(201, 201, 201);
    }
}
</style>
