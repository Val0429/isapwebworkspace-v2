<template>
    <div class="animated fadeIn">
        <iv-auto-card :label="transition.step === 7  ? _('w_Site_AddArea') :  _('w_Site_EditArea')">
            <template #toolbox>
                <iv-toolbox-back @click="pageToAreaList()" />
            </template>

            <iv-form
                :interface="IAreaForm()"
                :value="area"
                @update:*="updateAreaForm($event)"
                @submit="saveArea($event)"
            >

                <template #imageSrc="{ $attrs, $listeners}">
                    <img
                        class="imgSide"
                        v-if="areaPhotoSrc"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :src="areaPhotoSrc"
                    />
                </template>

                <template #imageMap="{ $attrs, $listeners}">
                    <div class="card-content iv-form-group col-md-12">
                        <image-map
                            ref="imageMap"
                            v-on:click-device="clickDevice"
                            v-on:drop="drop"
                            :imageMap="imageMap"
                        >
                        </image-map>
                    </div>
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageToAreaList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import ServerConfig from "@/services/ServerConfig";
import ImageBase64 from "@/services/ImageBase64";
import {
    DeviceNormalCameraItem,
    DeviceGroupItem,
    EDragType,
    ESetupMode,
    ImageMapItem,
    ImageBoxItem
} from "@/components/ImageMap";
import { ImageMap } from "@/components/ImageMap/ImageMap.vue";
import { IAreaAddData, IAreaEditData } from "@/config/default/api/interfaces";

interface IGoogleMap {
    src: string;
    zSize: string;
}

@Component({})
export class SiteAreaForm extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    site: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    area: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    transition;

    serverUrl = ServerConfig.url;
    newImg = new Image();
    imageMap = new ImageMapItem();
    newImgSrc = "";

    //area datas
    isSelectArea = false;
    areaPhotoSrc = "";
    areaMapSrc = "";
    areas = {};

    //device datas
    devicesGroupDevices = [];
    devicesGroupDevice = {};
    devices = [];
    device = {};

    created() {}

    mounted() {
        this.initMap();
        this.initImage();
    }

    clearAreaData() {
        this.isSelectArea = false;
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        this.area = {};
    }

    initImage() {
        if (this.transition.step === 8) {
            this.areaMapSrc = this.serverUrl + this.area.mapSrc;
        } else {
            this.areaMapSrc = ImageBase64.pngEmpty;
            this.imageMap.setupMode = ESetupMode.setup;
        }
    }

    async initMap() {
        this.getDeviceGroupData();
    }

    async getDeviceGroupData() {
        let body: {
            siteId: string;
            areaId: string;
        } = {
            siteId: this.site.objectId,
            areaId: this.area.objectId
        };

        await this.$server
            .R("/device/group/all", body)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.devicesGroupDevices = response;
                    this.getDeviceData();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async getDeviceData() {
        if (this.area) {
            let body: {
                paging: {
                    page: number;
                    pageSize: number;
                };
            } = {
                paging: {
                    page: 1,
                    pageSize: 999
                }
            };

            this.devices = [];

            await this.$server
                .R("/device", body)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            if (
                                response.results != undefined &&
                                response.results.length > 0
                            ) {
                                for (let item of response.results) {
                                    if (
                                        item.area &&
                                        item.area.objectId == this.area.objectId
                                    ) {
                                        this.devices.push(item);
                                    }
                                }
                                this.initImageMap();
                            }
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            this.initImageMap();
        }
    }

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
        this.imageMap.imageBox = new ImageBoxItem(this.areaMapSrc, {
            width: 1170,
            height: 665
        });

        ////////////////////////////////////////////////////////////////////

        // dataWindow in map
        // let dataWindow_license_map_1 = new DataWindowLicensePlateRecognitionItem(
        //     "License",
        //     EDragType.dataWindowInMap
        // );
        // let dataWindow_occupancy_map_1 = new DataWindowOccupancyItem(
        //     "Occupancy",
        //     EDragType.dataWindowInMap
        // );
        // let dataWindow_people_map_1 = new DataWindowPeopleCountingItem(
        //     "PeopleCounting",
        //     EDragType.dataWindowInMap
        // );

        // dataWindow_license_map_1.originalPosition = { x: 250, y: 100 };
        // dataWindow_occupancy_map_1.originalPosition = { x: 250, y: 250 };
        // dataWindow_people_map_1.originalPosition = { x: 250, y: 400 };

        // this.imageMap.imageBox.dataWindows = [];
        // this.imageMap.imageBox.dataWindows.push(dataWindow_license_map_1);
        // this.imageMap.imageBox.dataWindows.push(dataWindow_occupancy_map_1);
        // this.imageMap.imageBox.dataWindows.push(dataWindow_people_map_1);

        ////////////////////////////////////////////////////////////////////

        // device group
        this.imageMap.deviceGroups = [];
        for (let device of this.devices) {
            if (
                this.imageMap.deviceGroups.some(
                    i => i.objectId === device.groups.objectId
                )
            ) {
                continue;
            }

            let deviceGroup = new DeviceGroupItem(
                device.groups[0].name,
                EDragType.dataWindowInDeviceGroup,
                device.mode
            );

            deviceGroup.dataWindow.mode = ESetupMode.setup;
            deviceGroup.dataWindow.originalPosition = {
                x: device.dataWindowX,
                y: device.dataWindowY
            };

            this.imageMap.deviceGroups.push(deviceGroup);
        }

        ////////////////////////////////////////////////////////////////////

        // device
        this.imageMap.devices = [];
        for (let device of this.devices) {
            let deviceCamera = new DeviceNormalCameraItem(
                device.name,
                EDragType.deviceInTagLabel,
                device.mode
            );

            deviceCamera.dataWindow.mode = ESetupMode.setup;
            deviceCamera.originalPosition = {
                x: device.x,
                y: device.y
            };

            deviceCamera.rotate = device.visibleAngle;
            deviceCamera.viewerAngle = device.angle;
            //deviceCamera.visibleDistance = device.visibleDistance;

            this.imageMap.devices.push(deviceCamera);
        }

        // let deviceNormalCamera_1 = new DeviceFisheyeCameraItem(
        //     "Fisheye1",
        //     EDragType.deviceInTagLabel,
        //     EVideoSource.licensePlateRecognition
        // );

        // let deviceNormalCamera_2 = new DeviceFisheyeCameraItem(
        //     "Fisheye 2",
        //     EDragType.deviceInTagLabel,
        //     EVideoSource.occupancy
        // );

        // let deviceNormalCamera_3 = new DeviceNormalCameraItem(
        //     "Normal 3",
        //     EDragType.deviceInTagLabel,
        //     EVideoSource.peopleCounting
        // );

        // this.imageMap.devices = [];
        // this.imageMap.devices.push(deviceNormalCamera_1);
        // this.imageMap.devices.push(deviceNormalCamera_2);
        // this.imageMap.devices.push(deviceNormalCamera_3);

        // let deviceNormalCamera_4 = new DeviceFisheyeCameraItem(
        //     "Fisheye 4",
        //     EDragType.deviceInMap,
        //     EVideoSource.licensePlateRecognition
        // );

        // let deviceNormalCamera_5 = new DeviceNormalCameraItem(
        //     "Normal 5",
        //     EDragType.deviceInMap,
        //     EVideoSource.occupancy
        // );

        // let deviceNormalCamera_6 = new DeviceNormalCameraItem(
        //     "Normal 6",
        //     EDragType.deviceInMap,
        //     EVideoSource.peopleCounting
        // );

        // deviceNormalCamera_5.rotate = "0";
        // deviceNormalCamera_6.rotate = "150";

        // deviceNormalCamera_5.viewerAngle = "160";
        // deviceNormalCamera_6.viewerAngle = "45";

        // deviceNormalCamera_4.originalPosition = {
        //     x: 100,
        //     y: 100
        // };

        // deviceNormalCamera_5.originalPosition = {
        //     x: 300,
        //     y: 250
        // };

        // deviceNormalCamera_6.originalPosition = {
        //     x: 100,
        //     y: 500
        // };

        // deviceNormalCamera_4.dataWindow.originalPosition = {
        //     x: 800,
        //     y: 100
        // };

        // deviceNormalCamera_5.dataWindow.originalPosition = {
        //     x: 800,
        //     y: 250
        // };

        // deviceNormalCamera_6.dataWindow.originalPosition = {
        //     x: 800,
        //     y: 400
        // };

        // this.imageMap.devices.push(deviceNormalCamera_4);
        // this.imageMap.devices.push(deviceNormalCamera_5);
        // this.imageMap.devices.push(deviceNormalCamera_6);

        // deviceNormalCamera_6.dataWindow.inPerson = 10;
        // deviceNormalCamera_6.dataWindow.outPerson = 30;

        // deviceNormalCamera_6.dataWindow.inToday = 100;
        // deviceNormalCamera_6.dataWindow.outToday = 297;

        ////////////////////////////////////////////////////////////////////
        if (imageMapRef != undefined) {
            imageMapRef.start();
        }

        //TODO 可能用不到，先註解。
        // this.updateCheckboxControllers();
    }

    // updateCheckboxControllers() {
    //     this.checkboxControllers.setupMode =
    //         this.imageMap.setupMode == ESetupMode.setup;
    //     if (
    //         this.imageMap.draw.dataWindowInMap ||
    //         this.imageMap.draw.dataWindowInDeviceGroup ||
    //         this.imageMap.draw.dataWindowInDevice
    //     ) {
    //         this.checkboxControllers.showAllDataWindow = true;
    //     } else {
    //         this.checkboxControllers.showAllDataWindow = false;
    //     }
    // }

    async updateAreaForm(data) {
        if (data) {
            this.area[data.key] = data.value;
            if (data.key == "areaPhoto") {
                this.uploadFile(data.value);
                setTimeout(() => {
                    this.areaPhotoSrc = this.newImg.src;
                }, 300);
            }

            if (data.key == "mapPhoto") {
                this.uploadFile(data.value);
                setTimeout(() => {
                    this.imageMap.imageBox.src = this.newImg.src;
                    this.imageMap.imageBox.originalSize = {
                        width: this.newImg.width,
                        height: this.newImg.height
                    };
                }, 300);
            }
        }
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
    }

    drop(event: any) {
        // TODO: do something?
        console.log("!!! drop", event);
    }

    clickDevice(event: any, data: any) {
        // TODO: do something?
        console.log("!!! clickDevice", event, data);
    }

    async saveArea(data) {
        let threshold = { high: data.high, medium: data.medium, low: data.low };
        if (this.transition.step === 7) {
            const datas: IAreaAddData[] = [
                {
                    siteId: this.site.objectId,
                    name: data.name,
                    imageBase64: this.areaPhotoSrc,
                    mapBase64: this.imageMap.imageBox.src,
                    threshold: threshold
                }
            ];

            const addAreaParam = { datas };
            Loading.show();
            await this.$server
                .C("/location/area", addAreaParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Site_AddAreaSuccess"));
                            this.pageToAreaList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.transition.step === 8) {
            const datas: IAreaEditData[] = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    threshold: threshold
                }
            ];

            if (this.newImg.src) {
                datas[0].imageBase64 = this.areaPhotoSrc;
                datas[0].mapBase64 = this.imageMap.imageBox.src;
            }

            const editAreaParam = { datas };
            Loading.show();
            await this.$server
                .U("/location/area", editAreaParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Site_EditAreaSuccess"));
                            this.pageToAreaList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    pageToAreaList() {
        this.$emit("pageToAreaList");
    }

    IAreaForm() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 * @uiPlaceHolder - ${this._("w_Site_AreaName")}
                 */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_Photo")}
                * @uiPlaceHolder - ${this._("w_Site_Photo")}
                * @uiType - iv-form-file
                */
                areaPhoto: string;

                imageSrc?:any;

                 /**
                * @uiLabel - ${this._("w_Site_MapPhoto")}
                * @uiPlaceHolder - ${this._("w_Site_MapPhoto")}
                * @uiType - iv-form-file
                */
                mapPhoto?: string;

                /**
                 * @uiLabel - ${this._("w_Site_High")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                high?:number;

                 /**
                 * @uiLabel - ${this._("w_Site_Medium")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                medium?:number;

                 /**
                 * @uiLabel - ${this._("w_Site_Low")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                low?:number;

                imageMap?:any;

            }`;
    }
}
export default SiteAreaForm;
Vue.component("siteAreaForm", SiteAreaForm);
</script>

<style lang="scss" scoped>
</style>
