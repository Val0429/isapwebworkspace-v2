<template>
    <div
        class='data-window-people-counting'
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
            <toolbox-close
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
                <b-col cols="8">{{ _('m_ImageMap_DataWindowInTitle') }}</b-col>
                <b-col cols="4">{{ dataWindow.inPerson }}</b-col>
            </b-row>

            <b-row class='data-window-value'>
                <b-col cols="8">{{ _('m_ImageMap_DataWindowOutTitle') }}</b-col>
                <b-col cols="4">{{ dataWindow.outPerson }}</b-col>
            </b-row>

            <b-row class='data-window-column'>
                <b-col cols="8">{{ _('m_ImageMap_DataWindowInMOutTitle') }}</b-col>
                <b-col cols="4">{{dataWindow.totalPerson}}</b-col>
            </b-row>
            <b-row class='data-window-column'>
                <b-col cols="8">{{ _('m_ImageMap_DataWindowTotalTitle') }}</b-col>
                <b-col cols="4">{{dataWindow.totalToday}}</b-col>
            </b-row>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {
    EDragType,
    ImageMapItem,
    DataWindowPeopleCountingItem
} from "../models";

@Component({
    components: {}
})
export class DataWindowPeopleCounting extends Vue {
    eDragType = EDragType;

    // Prop
    @Prop({
        type: Object,
        default: new DataWindowPeopleCountingItem("", EDragType.none)
    })
    dataWindow: DataWindowPeopleCountingItem;

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

export default DataWindowPeopleCounting;
Vue.component("data-window-people-counting", DataWindowPeopleCounting);
</script>

<style lang="scss" scoped>
.data-window-people-counting {
    width: 185px;
    position: absolute;
    background-color: #004275;
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