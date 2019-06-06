<template>
    <div
        class='data-window-license-plate-recognition'
        draggable="true"
        :class="{'no-drop': dataWindow.pointerEventNone}"
        :style='dataWindow.dataWindowStyle'
        @dragstart="dragstart"
    >
        <b-row
            class='data-window-title'
            :class="{
            'in-map': dataWindow.dragType == eDragType.dataWindowInMap,
            'in-device-group' : dataWindow.dragType == eDragType.dataWindowInDeviceGroup,
            'in-device' : dataWindow.dragType == eDragType.dataWindowInDevice,
        }"
        >
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
            <b-row
                v-for="(value, index) in dataWindow.licensePlates"
                class='data-window-row'
                :key="'data__window__license__plate__recoginition__' + index"
            >
                <b-col
                    cols="12"
                    class='data-window-column'
                    :class="{
                        normal: value.bwListType == 'normal',
                        white: value.bwListType == 'white',
                        black: value.bwListType == 'black'
                    }"
                >
                    {{ value.plateNO }}
                </b-col>
            </b-row>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import {
    EDragType,
    ImageMapItem,
    DataWindowLicensePlateRecognitionItem
} from "../models";

@Component({
    components: {}
})
export class DataWindowLicensePlateRecognition extends Vue {
    eDragType = EDragType;

    // Prop
    @Prop({
        type: Object,
        default: new DataWindowLicensePlateRecognitionItem("", EDragType.none)
    })
    dataWindow: DataWindowLicensePlateRecognitionItem;

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

export default DataWindowLicensePlateRecognition;
Vue.component(
    "data-window-license-plate-recognition",
    DataWindowLicensePlateRecognition
);
</script>

<style lang="scss" scoped>
.data-window-license-plate-recognition {
    width: 185px;
    position: absolute;
    background-color: #fff;
    text-align: center;
    color: #000;
    padding: 0 15px;
    border-radius: 5px;
    border: 1px solid #aeaeae;
    pointer-events: auto;

    &.no-drop {
        pointer-events: none;
    }

    .data-window-hr {
        border-color: #f9f9f9;
        margin: 0;
    }

    .data-window-title {
        height: 30px;
        line-height: 30px;
        color: #000;
        border-bottom: 1px solid #aeaeae;
        background-color: #eee;

        &.in-map {
            // background-color: #32cbab;
            font-weight: bold;
        }

        &.in-device-group {
            // background-color: #ffa556;
            font-weight: bold;
        }

        &.in-device {
            // background-color: #0291ff;
            font-weight: bold;
        }
    }

    .data-window-row {
        border-bottom: 1px solid #aeaeae;

        &:last-child {
            border-bottom: 0px;
        }

        .data-window-row-hr {
            width: 80%;
            border-color: #f9f9f9;
            margin: 0 auto;
        }

        .data-window-column {
            width: 100%;
            &.normal {
            }
            &.black {
                color: #000;
                background-color: #f00;
            }
            &.white {
                color: #000;
                background-color: #7ab800;
            }
        }
    }

    .data-window-value {
        color: #f9f9f9;
    }
}
</style>
