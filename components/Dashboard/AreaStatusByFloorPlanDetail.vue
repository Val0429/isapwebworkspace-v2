<template>
    <div>
        <iv-card :label="_('w_ReportDashboard_Traffic')">
            <template #toolbox>
                <iv-toolbox-delete
                    @click="removeCard()"
                    :disabled="isDelete"
                />
            </template>
            <image-map
                ref="imageMap"
                v-on:click-add-tag-label="pageAddDeviceGroup"
                v-on:click-edit-tag-label="pageEditDeviceGroup"
                v-on:click-device="clickDevice"
                v-on:drop="drop"
                :imageMap="imageMap"
            >
            </image-map>

            <site-area-Group-device-filter class="mt-3"></site-area-Group-device-filter>

        </iv-card>
    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

import VueApexCharts from "vue-apexcharts";
Vue.component("apexchart", VueApexCharts);

import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";
import { ImageMap } from "@/components/ImageMap/ImageMap.vue";
import {
    EDragType,
    EVideoSource,
    ESetupMode,
    ImageMapItem,
    ImageBoxItem,
    DeviceGroupItem,
    DeviceNormalCameraItem,
    DeviceFisheyeCameraItem,
    DataWindowLicensePlateRecognitionItem,
    DataWindowOccupancyItem,
    DataWindowPeopleCountingItem
} from "@/components/ImageMap";

import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";

@Component({
    components: {
        ImageMap
    }
})
export class AreaStatusByFloorPlanDetail extends Vue {
    @Prop({
        type: Number,
        default: () => {
            return 0;
        }
    })
    datum: number;

    @Prop({
        type: Boolean,
        default: () => {
            return false;
        }
    })
    isDelete: boolean;

    imageMap = new ImageMapItem();

    created() {}

    mounted() {
        this.initImageMap();
    }

    // 建立 image map
    initImageMap() {
        let imageMapRef: any = this.$refs.imageMap;

        // imageMap mode

        this.imageMap.setupMode = ESetupMode.preview;

        // imageMap setting
        this.imageMap.draw.deviceGroupInTagLabel = true;
        this.imageMap.draw.deviceInTagLabel = true;
        this.imageMap.draw.dataWindowInMap = true;
        this.imageMap.draw.dataWindowInDeviceGroup = true;
        this.imageMap.draw.dataWindowInDevice = true;
        this.imageMap.draw.deviceInMap = true;
        this.imageMap.draw.nameInDevice = true;
        this.imageMap.draw.viewerInDevice = true;

        // image box
        this.imageMap.imageBox = new ImageBoxItem(
            "https://online.visual-paradigm.com/images/features/floor-plan-designer/01-online-floor-plan-maker.png",
            { width: 1170, height: 665 }
        );

        ////////////////////////////////////////////////////////////////////

        // dataWindow in map
        let dataWindow_license_map_1 = new DataWindowLicensePlateRecognitionItem(
            "License",
            EDragType.dataWindowInMap
        );
        let dataWindow_occupancy_map_1 = new DataWindowOccupancyItem(
            "Occupancy",
            EDragType.dataWindowInMap
        );
        let dataWindow_people_map_1 = new DataWindowPeopleCountingItem(
            "PeopleCounting",
            EDragType.dataWindowInMap
        );

        dataWindow_license_map_1.originalPosition = { x: 250, y: 100 };
        dataWindow_occupancy_map_1.originalPosition = { x: 250, y: 250 };
        dataWindow_people_map_1.originalPosition = { x: 250, y: 400 };

        this.imageMap.imageBox.dataWindows.push(dataWindow_license_map_1);
        this.imageMap.imageBox.dataWindows.push(dataWindow_occupancy_map_1);
        this.imageMap.imageBox.dataWindows.push(dataWindow_people_map_1);

        ////////////////////////////////////////////////////////////////////

        // device group
        let deviceGroup_licensePlateRecognition_1 = new DeviceGroupItem(
            "lic gro 1",
            EDragType.dataWindowInDeviceGroup,
            EVideoSource.licensePlateRecognition
        );

        let deviceGroup_occupancy_1 = new DeviceGroupItem(
            "occ gro 1",
            EDragType.dataWindowInDeviceGroup,
            EVideoSource.occupancy
        );

        let deviceGroup_peopleCounting_1 = new DeviceGroupItem(
            "peo gro 1",
            EDragType.dataWindowInDeviceGroup,
            EVideoSource.peopleCounting
        );

        deviceGroup_licensePlateRecognition_1.dataWindow.mode =
            ESetupMode.setup;
        deviceGroup_occupancy_1.dataWindow.mode = ESetupMode.setup;
        deviceGroup_peopleCounting_1.dataWindow.mode = ESetupMode.setup;

        deviceGroup_licensePlateRecognition_1.dataWindow.originalPosition = {
            x: 500,
            y: 100
        };

        deviceGroup_occupancy_1.dataWindow.originalPosition = {
            x: 500,
            y: 250
        };

        deviceGroup_peopleCounting_1.dataWindow.originalPosition = {
            x: 500,
            y: 400
        };

        this.imageMap.deviceGroups.push(deviceGroup_licensePlateRecognition_1);
        this.imageMap.deviceGroups.push(deviceGroup_occupancy_1);
        this.imageMap.deviceGroups.push(deviceGroup_peopleCounting_1);

        ////////////////////////////////////////////////////////////////////

        // device
        let deviceNormalCamera_1 = new DeviceFisheyeCameraItem(
            "Fisheye1",
            EDragType.deviceInTagLabel,
            EVideoSource.licensePlateRecognition
        );

        let deviceNormalCamera_2 = new DeviceFisheyeCameraItem(
            "Fisheye 2",
            EDragType.deviceInTagLabel,
            EVideoSource.occupancy
        );

        let deviceNormalCamera_3 = new DeviceNormalCameraItem(
            "Normal 3",
            EDragType.deviceInTagLabel,
            EVideoSource.peopleCounting
        );
        this.imageMap.devices.push(deviceNormalCamera_1);
        this.imageMap.devices.push(deviceNormalCamera_2);
        this.imageMap.devices.push(deviceNormalCamera_3);

        let deviceNormalCamera_4 = new DeviceFisheyeCameraItem(
            "Fisheye 4",
            EDragType.deviceInMap,
            EVideoSource.licensePlateRecognition
        );

        let deviceNormalCamera_5 = new DeviceNormalCameraItem(
            "Normal 5",
            EDragType.deviceInMap,
            EVideoSource.occupancy
        );

        let deviceNormalCamera_6 = new DeviceNormalCameraItem(
            "Normal 6",
            EDragType.deviceInMap,
            EVideoSource.peopleCounting
        );

        deviceNormalCamera_5.rotate = "0";
        deviceNormalCamera_6.rotate = "150";

        deviceNormalCamera_5.viewerAngle = "160";
        deviceNormalCamera_6.viewerAngle = "45";

        deviceNormalCamera_4.originalPosition = {
            x: 100,
            y: 100
        };

        deviceNormalCamera_5.originalPosition = {
            x: 300,
            y: 250
        };

        deviceNormalCamera_6.originalPosition = {
            x: 100,
            y: 500
        };

        deviceNormalCamera_4.dataWindow.originalPosition = {
            x: 800,
            y: 100
        };

        deviceNormalCamera_5.dataWindow.originalPosition = {
            x: 800,
            y: 250
        };

        deviceNormalCamera_6.dataWindow.originalPosition = {
            x: 800,
            y: 400
        };

        this.imageMap.devices.push(deviceNormalCamera_4);
        this.imageMap.devices.push(deviceNormalCamera_5);
        this.imageMap.devices.push(deviceNormalCamera_6);

        deviceNormalCamera_6.dataWindow.inPerson = 10;
        deviceNormalCamera_6.dataWindow.outPerson = 30;

        deviceNormalCamera_6.dataWindow.inToday = 100;
        deviceNormalCamera_6.dataWindow.outToday = 297;

        ////////////////////////////////////////////////////////////////////
        if (imageMapRef != undefined) {
            imageMapRef.start();
        }

        this.updateCheckboxControllers();
    }

    toggleButtonCols = "3";
    checkboxControllers: any = {
        setupMode: true,
        showAllDataWindow: true,
        minimizeAllDataWindow: false,
        minimizeMapDataWindow: false,
        minimizeDeviceGroupDataWindow: false,
        minimizeDeviceDataWindow: false
    };

    updateCheckboxControllers() {
        this.checkboxControllers.setupMode =
            this.imageMap.setupMode == ESetupMode.setup;
        if (
            this.imageMap.draw.dataWindowInMap ||
            this.imageMap.draw.dataWindowInDeviceGroup ||
            this.imageMap.draw.dataWindowInDevice
        ) {
            this.checkboxControllers.showAllDataWindow = true;
        } else {
            this.checkboxControllers.showAllDataWindow = false;
        }
    }

    pageAddDeviceGroup() {
        console.log("!!! pageAddDeviceGroup");
    }

    pageEditDeviceGroup(event: any, data: any) {
        for (let tempData of this.imageMap.deviceGroups) {
            if (data == tempData) {
                console.log("Edit - deviceGroupId: ", data.deviceGroupId);
            }
        }
    }

    clickDevice(event: any, data: any) {
        console.log("!!! clickDevice", event, data);
    }

    drop(event: any) {
        console.log("!!! drop", event);
    }

    removeCard() {
        console.log("devail", this.datum);
        this.$emit("removeCard", this.datum);
    }
}

export default AreaStatusByFloorPlanDetail;
Vue.component("area-status-by-floor-plan-detail", AreaStatusByFloorPlanDetail);
</script>

<style lang="scss" scoped>
</style>
