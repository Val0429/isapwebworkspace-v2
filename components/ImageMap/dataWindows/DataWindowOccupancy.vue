<template>
    <div
        class='data-window-occupancy'
        :class="{
            'in-map': dataWindow.dragType == eDragType.dataWindowInMap,
            'in-device-group' : dataWindow.dragType == eDragType.dataWindowInDeviceGroup,
            'in-device' : dataWindow.dragType == eDragType.dataWindowInDevice,
            'no-drop': dataWindow.pointerEventNone
        }"
        :style='dataWindow.dataWindowStyle'
        draggable="true"
        @dragstart="dragstart"
    >
        <b-row class='data-window-title'>
            <b-col>{{ dataWindow.title }}</b-col>
            <iv-toolbox-close
                variant="transparent"
                class="mr-1"
                @click="showOrNot"
            />
        </b-row>

        <div
            v-show="!dataWindow.minimizeDataWindow"
            class="data-window-content"
        >
            <hr class="data-window-hr">
            <b-row class='data-window-column'>
                <b-col cols="8">{{ _('w_ImageMap_DataWindowHrAgoTitle') }}</b-col>
                <b-col cols="4">{{ dataWindow.hrAgoPerson }}</b-col>
            </b-row>
            <b-row class='data-window-value'>
                <b-col cols="8">{{ _('w_ImageMap_DataWindowNowTitle') }}</b-col>
                <b-col cols="4">{{ dataWindow.nowPerson }}</b-col>
            </b-row>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { EDragType, ImageMapItem, DataWindowOccupancyItem } from "../models";

@Component({
    components: {}
})
export class DataWindowOccupancy extends Vue {
    eDragType = EDragType;

    // Prop
    @Prop({
        type: Object,
        default: new DataWindowOccupancyItem("", EDragType.none)
    })
    dataWindow: DataWindowOccupancyItem;

    // Vue step
    created() {}

    // drag & drop
    dragstart(event: any) {
        this.$emit(
            "drag-event",
            event,
            this.dataWindow.dragType,
            this.dataWindow
        );
    }

    // show dataWindow
    showOrNot() {
        this.dataWindow.minimizeDataWindow = !this.dataWindow
            .minimizeDataWindow;
    }
}

export default DataWindowOccupancy;
Vue.component("data-window-occupancy", DataWindowOccupancy);
</script>

<style lang="scss" scoped>
.data-window-occupancy {
    width: 185px;
    position: absolute;
    text-align: center;
    border-radius: 5px;
    color: #f9f9f9;
    padding: 0 15px;
    pointer-events: auto;

    &.no-drop {
        pointer-events: none;
    }

    &.in-map {
        background-color: #32cbab;
    }

    &.in-device-group {
        background-color: #ffa556;
    }

    &.in-device {
        background-color: #0291ff;
    }

    .data-window-hr {
        border-color: #f9f9f9;
        margin-top: 2px;
        margin-bottom: 2px;
    }

    .data-window-title {
        height: 30px;
        line-height: 30px;
    }

    .data-window-content {
        padding-top: 0;
        padding-bottom: 10px;
    }

    .data-window-column {
        margin-top: 5px;
    }

    .data-window-value {
        color: #f9f9f9;
    }
}
</style>
