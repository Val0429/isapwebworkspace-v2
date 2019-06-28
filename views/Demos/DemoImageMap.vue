<template>
    <div class="animated fadeIn">
        <div class="demo-control-row-view">

            <!-- all image map -->
            <b-row>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.setupMode"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="showSetupMode"
                    >
                        show setup mode
                    </b-form-checkbox>
                </b-col>

            </b-row>

            <!-- show data window -->
            <hr>
            <b-row>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.showAllDataWindow"
                        name="check-button"
                        button
                        button-variant="primary"
                        checked="true"
                        @change="showAllDataWindow"
                    >
                        show all data window
                    </b-form-checkbox>
                </b-col>
            </b-row>

            <b-row>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="imageMap.draw.dataWindowInMap"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="showMapDataWindow"
                    >
                        show map data window
                    </b-form-checkbox>
                </b-col>

                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="imageMap.draw.dataWindowInDeviceGroup"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="showDeviceGroupDataWindow"
                    >
                        show device group data window
                    </b-form-checkbox>
                </b-col>

                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="imageMap.draw.dataWindowInDevice"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="showDeviceDataWindow"
                    >
                        show device data window
                    </b-form-checkbox>
                </b-col>
            </b-row>

            <!-- minimize data window -->
            <hr>
            <b-row>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.minimizeAllDataWindow"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="minimizeAllDataWindow"
                    >
                        Minimize all data window
                    </b-form-checkbox>
                </b-col>
            </b-row>

            <b-row>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.minimizeMapDataWindow"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="minimizeMapDataWindow"
                    >
                        Minimize map data window
                    </b-form-checkbox>
                </b-col>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.minimizeDeviceGroupDataWindow"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="minimizeDeviceGroupDataWindow"
                    >
                        Minimize device group data window
                    </b-form-checkbox>
                </b-col>
                <b-col
                    class="demo-control-view"
                    :cols="toggleButtonCols"
                >
                    <b-form-checkbox
                        v-model="checkboxControllers.minimizeDeviceDataWindow"
                        name="check-button"
                        button
                        button-variant="primary"
                        @change="minimizeDeviceDataWindow"
                    >
                        Minimize device data window
                    </b-form-checkbox>
                </b-col>
            </b-row>

        </div>

        <hr>
        <!--------------------------- important --------------------------->
        <iv-card
            :visible="true"
            :label="_('w_ImageMap_CardTitle')"
        >
            <template #toolbox>
                <iv-toolbox-save
                    v-if="imageMap.setupMode == eSetupMode.setup"
                    @click="saveImageMap"
                />
                <iv-toolbox-divider v-if="imageMap.setupMode == eSetupMode.setup" />
                <iv-toolbox-back @click="pageBack" />
            </template>

            <div class="card-content">
                <image-map
                    ref="imageMap"
                    v-on:click-add-tag-label="pageAddDeviceGroup"
                    v-on:click-edit-tag-label="pageEditDeviceGroup"
                    v-on:click-device="clickDevice"
                    v-on:drop="drop"
                    :imageMap="imageMap"
                >
                </image-map>
            </div>

            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageBack"
                >{{ _('w_Back') }}
                </b-button>
                <b-button
                    v-if="imageMap.setupMode == eSetupMode.setup"
                    variant="primary"
                    size="lg"
                    @click="saveImageMap"
                >{{ _('w_Save') }}
                </b-button>
            </template>
        </iv-card>
        <!--------------------------- important --------------------------->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
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
import DeviceFisheyeCamera from "../components/Map/DeviceFisheyeCamera.vue";

@Component({
    components: {
        ImageMap
    }
})
export default class DemoImageMap extends Vue {
    eSetupMode = ESetupMode;
    imageMap = new ImageMapItem();

    created() {}

    mounted() {
        this.initImageMap();
    }

    // 建立 image map
    initImageMap() {
        let imageMapRef: any = this.$refs.imageMap;

        // imageMap mode
        // this.imageMap.setupMode = ESetupMode.preview;
        this.imageMap.setupMode = ESetupMode.setup;

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

    pageBack() {
        console.log("!!! pageBack");
    }

    pageAddDeviceGroup() {
        console.log("!!! pageAddDeviceGroup");
    }

    pageEditDeviceGroup(event: any, data: any) {
        console.log("!!! pageEditDeviceGroup", event, data);
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

    // save
    async saveImageMap() {
        console.log("!!! saveImageMap");
    }

    //////////////////////////// only by demo  ////////////////////////////

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

    // show Setting mode
    showSetupMode(event: boolean) {
        let imageMapRef: any = this.$refs.imageMap;
        this.imageMap.setupMode = event ? ESetupMode.preview : ESetupMode.setup;
        if (imageMapRef != undefined) {
            imageMapRef.start();
        }
        this.updateCheckboxControllers();
    }

    // show data window
    showAllDataWindow(event: boolean) {
        this.imageMap.draw.dataWindowInMap = event;
        this.imageMap.draw.dataWindowInDeviceGroup = event;
        this.imageMap.draw.dataWindowInDevice = event;
        this.updateCheckboxControllers();
    }

    showMapDataWindow(event: boolean) {
        this.imageMap.draw.dataWindowInMap = event;
        this.updateCheckboxControllers();
    }

    showDeviceGroupDataWindow(event: boolean) {
        this.imageMap.draw.dataWindowInDeviceGroup = event;
        this.updateCheckboxControllers();
    }

    showDeviceDataWindow(event: boolean) {
        this.imageMap.draw.dataWindowInDevice = event;
        this.updateCheckboxControllers();
    }

    // minimize data window
    minimizeAllDataWindow(event: boolean) {
        for (let dataWindow of this.imageMap.imageBox.dataWindows) {
            dataWindow.minimizeDataWindow = event;
        }
        for (let deviceGroup of this.imageMap.deviceGroups) {
            deviceGroup.dataWindow.minimizeDataWindow = event;
        }
        for (let device of this.imageMap.devices) {
            device.dataWindow.minimizeDataWindow = event;
        }
        this.updateCheckboxControllers();
    }

    minimizeMapDataWindow(event: boolean) {
        for (let dataWindow of this.imageMap.imageBox.dataWindows) {
            dataWindow.minimizeDataWindow = event;
        }
        this.updateCheckboxControllers();
    }

    minimizeDeviceGroupDataWindow(event: boolean) {
        for (let deviceGroup of this.imageMap.deviceGroups) {
            deviceGroup.dataWindow.minimizeDataWindow = event;
        }
        this.updateCheckboxControllers();
    }

    minimizeDeviceDataWindow(event: boolean) {
        for (let device of this.imageMap.devices) {
            device.dataWindow.minimizeDataWindow = event;
        }
        this.updateCheckboxControllers();
    }
}
</script>

<style lang="scss" scoped>
.demo-control-row-view {
    width: 98%;
    .demo-control-view {
        margin: 10px;
    }
}
</style>
