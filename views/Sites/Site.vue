<template>
    <div class="animated fadeIn">
        <!--Site List-->
        <div v-if="pageStep === ePageStep.siteList">
            <iv-card :label="_('w_Site_SiteList')">

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="!isSelectSite"
                        @click="pageToSiteView()"
                    />
                    <iv-toolbox-edit
                        :disabled="!isSelectSite"
                        @click="pageToSiteEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="!isSelectSite"
                        @click="deleteSite()"
                    />

                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToSiteAdd()" />

                </template>

                <iv-table
                    ref="siteTable"
                    :interface="ISiteList()"
                    @selected="selectedSite($event)"
                    :server="{ path: '/location/site' }"
                    :multiple="tableMultiple"
                >

                    <template #establishment="{$attrs, $listeners}">
                        {{$attrs.row.establishment ? showTime($attrs.row.establishment) : ""}}
                    </template>

                    <template #manager="{$attrs, $listeners}">
                        {{$attrs.row.manager ? $attrs.row.manager.name : ""}}
                    </template>

                    <template #areaName="{$attrs, $listeners}">
                        {{showArea($attrs.row.objectId)}}
                    </template>

                    <template #deviceGroupName="{$attrs, $listeners}">
                        {{showDeviceGroup($attrs.row.objectId,'site')}}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="!isSelectSite">
                            <iv-toolbox-area @click="pageToAreaList()" />
                            <iv-toolbox-device-group @click="pageToDeviceList()" />
                        </iv-toolbox-more>
                    </template>
                </iv-table>

            </iv-card>
        </div>

        <!--Site From (Add and Edit)-->
        <div v-if="pageStep === ePageStep.siteAdd || pageStep === ePageStep.siteEdit">
            <iv-auto-card :label="pageStep == ePageStep.siteAdd ? _('w_Site_AddSite') :  _('w_Site_EditSite')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToSiteList()" />
                </template>

                <iv-form
                    :interface="ISiteFrom()"
                    :value="site"
                    @update:*="updateSiteFrom($event)"
                    @submit="saveSite($event)"
                >

                    <template #officeHour="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                            :options="officeHourItem"
                        >
                        </iv-form-selection>
                    </template>

                    <template #managerId="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                            :options="managerItem"
                        >
                        </iv-form-selection>
                    </template>

                    <template #tag="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                            :options="tagItem"
                            :multiple="true"
                        >
                        </iv-form-selection>
                    </template>

                    <template #imageSrc="{ $attrs, $listeners}">
                        <img
                            class="imgSide"
                            v-if="newImgSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :src="newImgSrc"
                        />
                    </template>

                    <template #mapping="{ $attrs, $listeners }">
                        <div class="googleMap">
                            <b-button
                                variant="secondary"
                                size="md"
                                @click="googleMapMapping()"
                            >{{ _('w_Site_Mapping') }}
                            </b-button>
                        </div>
                    </template>

                    <template #googleMap="{ $attrs, $listeners, index }">
                        <iframe
                            v-if="gooleMapSrc != ''"
                            class="googleMap"
                            allowfullscreen=""
                            width="800"
                            height="600"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            :src="gooleMapSrc"
                        >
                        </iframe>
                    </template>

                    <template #footer-before>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToSiteList()"
                        >{{ _('w_Back') }}
                        </b-button>
                    </template>
                </iv-form>

            </iv-auto-card>
        </div>

        <!--Site View-->
        <div v-if="pageStep === ePageStep.siteView">
            <iv-card :label="_('w_Site_ViewSite')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToSiteList()" />
                </template>

                <iv-form
                    :interface="ISiteView()"
                    :value="site"
                >

                    <template #establishment="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="$attrs.value ? showTime($attrs.value) : ''"
                        />
                    </template>

                    <template #officeHour="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="$attrs.value ? showOfficeHour($attrs.value) : ''"
                        />
                    </template>

                    <template #managerId="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="$attrs.value ? showManager($attrs.value) : ''"
                        />
                    </template>

                    <template #tag="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="site.tag ? showTags(site.tag) : ''"
                        />
                    </template>

                    <template #imageSrc="{ $attrs, $listeners}">
                        <label class="col-md-12">
                            {{_("w_Site_Photo")}}
                        </label>
                        <img
                            class="imgSide"
                            v-if="newImgSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :src="newImgSrc"
                        />
                    </template>

                    <template #googleMap="{ $attrs, $listeners, index }">
                        <iframe
                            v-if="gooleMapSrc != ''"
                            class="googleMap"
                            allowfullscreen=""
                            width="800"
                            height="600"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            :src="gooleMapSrc"
                        >
                        </iframe>
                    </template>

                </iv-form>

                <template #footer>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToSiteList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>
            </iv-card>
        </div>

        <!--Area List-->
        <div v-if="pageStep === ePageStep.areaList">
            <iv-card :label=" _('w_Site_AreaList') ">

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="!isSelectArea"
                        @click="pageToAreaView()"
                    />
                    <iv-toolbox-edit
                        :disabled="!isSelectArea"
                        @click="pageToAreaEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="!isSelectArea"
                        @click="deleteArea()"
                    />

                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAreaAdd()" />
                    <iv-toolbox-back @click="pageToSiteList()" />

                </template>

                <iv-table
                    ref="areaTable"
                    :interface="IAreaList()"
                    @selected="selectedArea($event)"
                    :multiple="tableMultiple"
                    :server="{  path: '/location/area' }"
                    :params="areaParams"
                >

                    <template #siteName="{$attrs, $listeners}">
                        {{$attrs.row.site ? $attrs.row.site.name : ""}}
                    </template>

                    <template #deviceGroupName="{$attrs, $listeners}">
                        {{showDeviceGroup($attrs.row.objectId,'area')}}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="!isSelectArea">
                            <iv-toolbox-device-group @click="pageToDeviceList()" />
                        </iv-toolbox-more>
                    </template>
                </iv-table>

            </iv-card>
        </div>

        <!--Area From (Add and Edit)-->
        <div v-if="pageStep === ePageStep.areaAdd || pageStep === ePageStep.areaEdit">
            <iv-auto-card :label="pageStep == ePageStep.areaAdd ? _('w_Site_AddArea') :  _('w_Site_EditArea')">
                <template #toolbox>
                    <iv-toolbox-back @click="pageToAreaList()" />
                </template>

                <iv-form
                    :interface="IAreaFrom()"
                    :value="area"
                    @update:*="updateAreaFrom($event)"
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
                                v-on:click-add-tag-label="pageAddDeviceGroup"
                                v-on:click-edit-tag-label="pageEditDeviceGroup"
                                v-on:click-device="clickDevice"
                                v-on:drop="drop"
                                :imageMap="imageMap"
                            >
                            </image-map>
                        </div>
                    </template>

                    <template #footer-before>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToAreaList()"
                        >{{ _('w_Back') }}
                        </b-button>
                    </template>
                </iv-form>
            </iv-auto-card>
        </div>

        <!--Area View-->
        <div v-if="pageStep === ePageStep.areaView">
            <iv-card :label=" _('w_Site_ViewArea')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToAreaList()" />
                </template>

                <iv-form
                    :interface="IAreaView()"
                    :value="area"
                >

                    <template #siteName="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="area.site ? area.site.name  : ''"
                        />
                    </template>

                    <template #imageSrc="{ $attrs, $listeners}">
                        <label class="col-md-12">
                            {{_("w_Site_Photo")}}
                        </label>
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
                                v-on:click-add-tag-label="pageAddDeviceGroup"
                                v-on:click-edit-tag-label="pageEditDeviceGroup"
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
            </iv-card>
        </div>

        <!--Device List-->
        <div v-if="pageStep === ePageStep.deviceList">
            <iv-card :label=" _('w_Site_DeviceList')">

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="!isSelectDevice"
                        @click="pageToDeviceView()"
                    />
                    <iv-toolbox-edit
                        :disabled="!isSelectDevice"
                        @click="pageToDeviceEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="!isSelectDevice"
                        @click="deleteDevice()"
                    />

                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToDeviceAdd()" />
                    <iv-toolbox-back @click="pageToSiteList()" />

                </template>

                <iv-table
                    ref="deviceTable"
                    :interface="IDeviceList()"
                    @selected="selectedDevice($event)"
                    :multiple="tableMultiple"
                    :server="{path: '/device/group' }"
                    :params="deviceGroupParams"
                >
                    <template #siteName="{$attrs, $listeners}">
                        {{$attrs.row.site ? $attrs.row.site.name : '' }}
                    </template>

                    <template #areaName="{$attrs, $listeners}">
                        {{$attrs.row.area ? $attrs.row.area.name : '' }}
                    </template>

                    <template #deviceGroupName="{$attrs, $listeners}">
                        {{$attrs.row.name ? $attrs.row.name : '' }}
                    </template>

                    <template #devices="{$attrs, $listeners}">

                        <div @mouseover="showDeviceDetialShow($attrs.row.devices)">{{showDevices($attrs.row.devices)}}</div>
                    </template>

                </iv-table>

            </iv-card>
        </div>

        <!--Device From (Add and Edit)-->
        <div v-if="pageStep === ePageStep.deviceAdd || pageStep === ePageStep.deviceEdit">
            <iv-auto-card :label="pageStep == ePageStep.deviceAdd ? _('w_Site_AddDevice') :  _('w_Site_EditDevice')">
                <template #toolbox>
                    <iv-toolbox-back @click="pageToDeviceList()" />
                </template>

                <iv-form
                    :interface="IDeviceFrom()"
                    :value="deviceGroup"
                    @update:*="updateDeviceFrom($event)"
                    @submit="saveDevice($event)"
                >

                    <template #siteName="{$attrs, $listeners}">
                        <iv-form-label
                            v-if="pageStep === ePageStep.deviceAdd"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="site.name ? site.name : '' "
                        />
                        <iv-form-label
                            v-if="pageStep === ePageStep.deviceEdit"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="deviceGroup.site ? deviceGroup.site.name : '' "
                        />
                    </template>

                    <template #areaName="{$attrs, $listeners}">
                        <iv-form-selection
                            v-if="pageStep === ePageStep.deviceAdd && isEmptyObject(area)"
                            v-bind="$attrs"
                            :value="$attrs.value ? $attrs.value : ''"
                            v-on="$listeners"
                            :multiple="false"
                            :options="areaNameItem"
                        >
                        </iv-form-selection>
                        <iv-form-label
                            v-if="pageStep === ePageStep.deviceAdd && !isEmptyObject(area)"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="area ? area.name : '' "
                        />
                        <iv-form-label
                            v-if="pageStep === ePageStep.deviceEdit"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="deviceGroup.area ? deviceGroup.area.name : '' "
                        />
                    </template>

                    <template #deviceName="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            :value="$attrs.value ? $attrs.value.join(',') : ''"
                            v-on="$listeners"
                            :multiple="true"
                            :options="ShowDeviceItem(deviceNameItem)"
                        >
                        </iv-form-selection>
                    </template>

                    <template #footer-before>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToDeviceList()"
                        >{{ _('w_Back') }}
                        </b-button>
                    </template>
                </iv-form>
            </iv-auto-card>
        </div>

        <!--Device View-->
        <div v-if="pageStep === ePageStep.deviceView">
            <iv-card :label=" _('w_Site_ViewDevice')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToDeviceList()" />
                </template>

                <iv-form
                    :interface="IDeviceView()"
                    :value="deviceGroup"
                >

                    <template #siteName="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="deviceGroup.site ? deviceGroup.site.name : '' "
                        />
                    </template>

                    <template #areaName="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="deviceGroup.area ? deviceGroup.area.name : '' "
                        />
                    </template>

                    <template #deviceGroupName="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="deviceGroup ? deviceGroup.name : '' "
                        />
                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToDeviceList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>
            </iv-card>
        </div>

        <b-modal
            hide-footer
            hide-header
            size="md"
            :title="_('w_DeviceGroup')"
            v-model="modalShow"
        >
            <template v-for="(value, index) in modalContext">
                <p>{{value.mode + " : " + value.count}}</p>
            </template>

        </b-modal>

    </div>

</template>

<script lang="ts">
import {
    Vue,
    Component,
    Watch,
    iSAPServerBase,
    MetaParser,
    createDecorator,
    toEnumInterface
} from "../../../core";
import ImageBase64 from "@/services/ImageBase64";
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog/Dialog";
import Datetime from "@/services/Datetime.vue";
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
} from "@/components/ImageMap/models";
import ResponseFilter from "@/services/ResponseFilter";
import {
    ISiteAddData,
    ISiteEditData,
    IAreaAddData,
    IAreaEditData,
    ITagReadUpdate,
    IOfficeHourEditData
} from "@/config/default/api/interfaces";

enum EPageStep {
    siteList = "siteList",
    siteView = "siteView",
    siteAdd = "siteAdd",
    siteEdit = "siteEdit",

    areaList = "areaList",
    areaView = "areaView",
    areaAdd = "areaAdd",
    areaEdit = "areaEdit",

    deviceList = "deviceList",
    deviceView = "deviceView",
    deviceAdd = "deviceAdd",
    deviceEdit = "deviceEdit",

    none = "none"
}

interface IGoogleMap {
    src: string;
    zSize: string;
}

@Component({
    components: {}
})
export default class Site extends Vue {
    serverUrl = ServerConfig.url;
    newImg = new Image();
    newImgSrc = "";
    tableMultiple = false;
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    imageMap = new ImageMapItem();
    isMounted = false;
    modalShow = false;
    modalContext = [];

    //google map
    googleMap: IGoogleMap = {
        src: "https://maps.google.com/maps?output=embed",
        zSize: "16"
    };

    //site datas
    isSelectSite = false;
    sites = {};
    site = {};
    gooleMapSrc = "";

    //area datas
    isSelectArea = false;
    areaPhotoSrc = "";
    areas = {};
    area = {};
    areaParams = {};
    areaAll = [];

    //device datas
    isSelectDevice = false;
    deviceGroups = {};
    deviceGroup = {};
    deviceGroupParams = {};
    deviceGroupAll = [];

    //options
    managerItem = [];
    tagItem = [];
    officeHourItem = [];
    deviceTypeItem = {};
    deviceNameItem = [];
    areaNameItem = [];

    created() {}

    mounted() {
        this.isMounted = true;
        this.pageToSiteList();
    }

    drop(event: any) {
        console.log("!!! drop", event);
    }

    clickDevice(event: any, data: any) {
        console.log("!!! clickDevice", event, data);
    }

    initImageMap() {
        console.log("initImageMap", this.imageMap);

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

        this.imageMap.imageBox.dataWindows = [];
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

        this.imageMap.deviceGroups = [];
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

        this.imageMap.devices = [];
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

    pageToAreaList() {
        this.clearDeviceData();
        this.pageStep = EPageStep.areaList;
    }

    pageToAreaView() {
        console.log("pageToAreaView", this.area);
        this.areaPhotoSrc = this.serverUrl + this.area["imageSrc"];
        this.initImageMap();
        this.imageMap.setupMode = ESetupMode.preview;
        this.pageStep = EPageStep.areaView;
    }

    pageToAreaAdd() {
        this.clearAreaData();
        this.initImageMap();
        this.imageMap.setupMode = ESetupMode.setup;
        this.pageStep = EPageStep.areaAdd;
    }

    pageToAreaEdit() {
        this.initImageMap();
        this.pageStep = EPageStep.areaEdit;
    }

    pageToDeviceList() {
        this.pageStep = EPageStep.deviceList;
    }

    pageToDeviceView() {
        console.log("pageToDeviceView", this.site);
        this.newImgSrc = this.serverUrl + this.site["imageSrc"];
        this.pageStep = EPageStep.deviceView;
    }

    pageToDeviceAdd() {
        this.clearDeviceData();
        this.initDeviceTypeItem();

        this.pageStep = EPageStep.deviceAdd;
    }

    pageToDeviceEdit() {
        this.initDeviceTypeItem();
        this.pageStep = EPageStep.deviceEdit;
    }

    async initSiteListArea() {
        this.areaAll = [];

        await this.$server
            .R("/location/area/all", {})
            .then((response: any) => {
                this.areaAll = response;
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async initSiteListDeviceGroup() {
        this.deviceGroupAll = [];

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

        await this.$server
            .R("/device/group", body)
            .then((response: any) => {
                console.log("deviceGroupAll", response);
                this.deviceGroupAll = response.results;
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    pageToSiteList() {
        this.initSiteListArea();
        this.initSiteListDeviceGroup();
        this.clearAreaData();
        this.clearDeviceData();
        this.pageStep = EPageStep.siteList;
    }

    pageToSiteView() {
        this.newImgSrc = this.serverUrl + this.site["imageSrc"];
        this.googleMapMapping();
        this.pageStep = EPageStep.siteView;
    }

    pageToSiteAdd() {
        this.clearSiteData();
        this.pageStep = EPageStep.siteAdd;
    }

    pageToSiteEdit() {
        this.newImgSrc = this.serverUrl + this.site["imageSrc"];
        this.pageStep = EPageStep.siteEdit;
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

    async initDeviceNameItem() {
        this.deviceNameItem = [
            // { id: "1", text: "device1", type: "peopleCounting" },
            // { id: "2", text: "device2", type: "dwellTime" },
            // { id: "3", text: "device3", type: "humanDetection" }
        ];

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

        await this.$server
            .R("/device", body)
            .then((response: any) => {
                console.log("initDeviceNameItem", response);
                for (let item of response) {
                    let device = {
                        id: item.objectId,
                        text: item.name,
                        type: item.mode
                    };
                    this.deviceNameItem.push(device);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async initDeviceTypeItem() {
        this.deviceTypeItem = {
            peopleCounting: "People Counting",
            dwellTime: "Dwell Time",
            demographic: "Demographic",
            heatmap: "Heatmap",
            visitor: "Visitor",
            humanDetection: "Human Detection"
        };

        this.initDeviceNameItem();
    }

    async initAreaNameItem() {
        this.areaNameItem = [];

        let body: {
            siteId: string;
        } = {
            siteId: this.site["objectId"]
        };

        await this.$server
            .R("/location/area/all", body)
            .then((response: any) => {
                for (let item of response) {
                    let area = { id: item.objectId, text: item.name };
                    this.areaNameItem.push(area);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async initManagerItem() {
        this.managerItem = [];

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

        await this.$server
            .R("/user/user/all", body)
            .then((response: any) => {
                for (let user of response) {
                    let manager = { id: user.objectId, text: user.name };
                    this.managerItem.push(manager);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async initOfficeHourItem() {
        this.officeHourItem = [];

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

        await this.$server
            .R("/office-hour/all", body)
            .then((response: any) => {
                for (let itme of response) {
                    let officeHour = { id: itme.objectId, text: itme.name };
                    this.officeHourItem.push(officeHour);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });

        await this.$server
            .R("/office-hour", body)
            .then((response: any) => {
                this.site["officeHour"] = [];
                for (let item of response.results) {
                    for (let subItem of item.sites) {
                        if (subItem.objectId == this.site["objectId"]) {
                            this.site["officeHour"] = item.objectId;
                            break;
                        }
                    }
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async initTagItem() {
        this.tagItem = [];

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

        await this.$server
            .R("/tag/all", body)
            .then((response: any) => {
                for (let itme of response) {
                    let tag = { id: itme.objectId, text: itme.name };
                    this.tagItem.push(tag);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });

        await this.$server
            .R("/tag", body)
            .then((response: any) => {
                this.site["tag"] = [];
                for (let item of response.results) {
                    for (let subItem of item.sites) {
                        if (subItem.objectId == this.site["objectId"]) {
                            this.site["tag"].push(item.objectId);
                            break;
                        }
                    }
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async saveSite(data) {
        console.log("saveSite", data);

        if (this.pageStep == EPageStep.siteAdd) {
            const datas: ISiteAddData[] = [
                {
                    // regionId: "uCsinPqUj1",
                    name: data.name,
                    customId: data.customId,
                    managerId: data.manager,
                    address: data.address,
                    phone: data.phone,
                    establishment: data.establishment,
                    squareMeter: data.squareMeter,
                    staffNumber: data.staffNumber,
                    officeHourId: data.officeHour,
                    imageBase64: this.newImgSrc,
                    longitude: data.longitude,
                    latitude: data.latitude
                }
            ];

            const addSiteParam = { datas };

            await this.$server
                .C("/location/site", addSiteParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_AddSiteSuccess"));
                        this.pageToSiteList();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        } else if (this.pageStep == EPageStep.siteEdit) {
            const datas: ISiteEditData[] = [
                {
                    // regionId: "uCsinPqUj1",
                    objectId: data.objectId,
                    name: data.name,
                    customId: data.customId,
                    managerId: data.manager,
                    address: data.address,
                    phone: data.phone,
                    establishment: data.establishment,
                    squareMeter: data.squareMeter,
                    staffNumber: data.staffNumber,
                    officeHourId: data.officeHour,
                    longitude: data.longitude,
                    latitude: data.latitude
                }
            ];

            if (this.newImg.src) {
                datas[0].imageBase64 = this.newImgSrc;
            }

            const editSiteParam = { datas };

            await this.$server
                .U("/location/site", editSiteParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_EditSiteSuccess"));
                        this.pageToSiteList();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        }

        //update tags
        let tbody: {
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

        await this.$server
            .R("/tag", tbody)
            .then((response: any) => {
                var tagList = response.results;

                const datas: ITagReadUpdate[] = [];
                var items = [];
                for (let tagId of data.tag) {
                    //新site
                    let item = {
                        objectId: tagId,
                        siteIds: [data.objectId]
                    };

                    //原本有的site也加進去
                    for (let tagItem of tagList) {
                        if (tagItem.objectId === tagId) {
                            for (let site of tagItem.sites) {
                                item.siteIds.push(site.objectId);
                            }
                        }
                    }
                    datas.push(item);
                }
                const tagParam = { datas };
                this.$server
                    .U("/tag", tagParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            console.log("tags update Success");
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.base(this, e);
                    });
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async saveArea(data) {
        console.log("saveArea", data);

        if (this.pageStep == EPageStep.areaAdd) {
            const datas: IAreaAddData[] = [
                {
                    siteId: this.site["objectId"],
                    name: data.name,
                    imageBase64: this.areaPhotoSrc,
                    mapBase64: this.imageMap.imageBox.src
                }
            ];

            const addAreaParam = { datas };

            await this.$server
                .C("/location/area", addAreaParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_AddAreaSuccess"));
                        this.pageToAreaList();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        } else if (this.pageStep == EPageStep.areaEdit) {
            const datas: IAreaEditData[] = [
                {
                    objectId: data.objectId,
                    name: data.name
                }
            ];

            if (this.newImg.src) {
                datas[0].imageBase64 = this.areaPhotoSrc;
                datas[0].mapBase64 = this.imageMap.imageBox.src;
            }

            const editAreaParam = { datas };

            await this.$server
                .U("/location/area", editAreaParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_EditAreaSuccess"));
                        this.pageToAreaList();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        }
    }

    async deleteSite() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            var body: {
                objectId: string;
            } = {
                objectId: this.site["objectId"]
            };
            this.$server
                .D("/location/site", body)
                .then((response: any) => {
                    if (response) {
                        Dialog.success(this._("w_Success"));
                        (this.$refs.siteTable as any).reload();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        });
    }

    async deleteArea() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            var body: {
                objectId: string;
            } = {
                objectId: this.area["objectId"]
            };
            this.$server
                .D("/location/area", body)
                .then((response: any) => {
                    if (response) {
                        Dialog.success(this._("w_Success"));

                        (this.$refs.areaTable as any).reload();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        });
    }

    async saveDevice(data) {
        console.log("saveDevice", data);

        if (this.pageStep == EPageStep.deviceAdd) {
            console.log("deviceAdd", data);
        } else if (this.pageStep == EPageStep.deviceEdit) {
            console.log("deviceEdit", data);
        }
    }

    async deleteDevice() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            var body: {
                objectId: string;
            } = {
                objectId: this.site["objectId"]
            };
            this.$server
                .D("/location/device", body)
                .then((response: any) => {
                    if (response) {
                        Dialog.success(this._("w_Success"));
                        (this.$refs.deviceTable as any).reload();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        });
    }

    googleMapMapping() {
        console.log("googleMapMapping", this.site);
        if (this.site) {
            if (
                parseFloat(this.site["longitude"]) > 180 ||
                parseFloat(this.site["longitude"]) < -180
            ) {
                console.log("ING", parseFloat(this.site["longitude"]));
                Dialog.error(this._("w_Site_Longitude_Range"));
                return;
            }

            if (
                parseFloat(this.site["latitude"]) > 90 ||
                parseFloat(this.site["latitude"]) < -90
            ) {
                Dialog.error(this._("w_Site_Latitude_Range"));
                return;
            }
            this.gooleMapSrc =
                this.googleMap.src +
                "&z=" +
                this.googleMap.zSize +
                "&q=" +
                this.site["latitude"] +
                "," +
                this.site["longitude"];
        }
    }

    updateSiteFrom(data) {
        console.log("updateSiteFrom", data);
        if (data) {
            this.site[data.key] = data.value;
            if (data.key == "sitePhoto") {
                this.uploadFile(data.value);
            }
        }
    }

    async updateAreaFrom(data) {
        console.log("updateAreaFrom", data);
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

    updateDeviceFrom(data) {
        console.log("updateDeviceFrom", data);
        if (data) {
            this.deviceGroup[data.key] = data.value;
        }
    }

    selectedDevice(data) {
        console.log("selectedDevice", data);
        this.newImgSrc = "";
        if (data) {
            this.deviceGroup = this.isSelectDevice = data;
        } else {
            this.clearDeviceData();
        }
    }

    selectedArea(data) {
        console.log("selectedArea", data);
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        if (data) {
            this.area = this.isSelectArea = data;
            this.deviceGroupParams = {
                areaId: data.objectId
            };
        } else {
            this.clearAreaData();
        }
    }

    selectedSite(data) {
        console.log("selectedSite", data);
        this.newImgSrc = "";
        this.gooleMapSrc = "";
        if (data) {
            data.managerId = data.manager
                ? data.manager.objectId
                : data.manager;
            data.establishment = new Date(data.establishment);
            this.site = this.isSelectSite = data;
            this.areaParams = {
                siteId: data.objectId
            };
            this.deviceGroupParams = {
                siteId: data.objectId
            };
            this.initManagerItem();
            this.initTagItem();
            this.initOfficeHourItem();
            this.initAreaNameItem();
        } else {
            this.clearSiteData();
        }
    }

    pageSize(data) {
        console.log("pageSize", data);
    }

    clearDeviceData() {
        this.isSelectDevice = false;
        this.newImgSrc = "";
        this.deviceGroup = {};
    }

    clearAreaData() {
        this.isSelectArea = false;
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        this.area = {};
    }

    clearSiteData() {
        this.initManagerItem();
        this.initTagItem();
        this.initOfficeHourItem();
        this.isSelectSite = false;
        this.gooleMapSrc = "";
        this.newImgSrc = "";
        this.site = {};
    }

    ShowDeviceItem(value) {
        console.log("ShowDeviceItem", value, this.deviceGroup);
        return value.filter(v => v.type == this.deviceGroup["deviceType"]);
    }

    showFirst(value): string {
        if (value.length >= 2) {
            return value.map(item => item)[0] + "...";
        }
        if (value.length === 1) {
            return value.map(item => item)[0];
        }
        if (value.length == 0) {
            return "";
        }
    }

    showArea(value) {
        let areas = [];
        for (let area of this.areaAll) {
            if (area.site.objectId == value) {
                areas.push(area.name);
            }
        }

        return this.showFirst(areas);
    }

    showDeviceGroup(value, type) {
        let deviceGroups = [];
        for (let devicegroup of this.deviceGroupAll) {
            var mapId = "";
            if (type == "site") {
                mapId = devicegroup.site.objectId;
            } else if (type == "area") {
                mapId = devicegroup.area.objectId;
            }

            if (mapId == value) {
                deviceGroups.push(devicegroup.name);
            }
        }

        return this.showFirst(deviceGroups);
    }

    showDevices(values) {
        let count = 0;
        if (values) {
            for (let value of values) {
                count += value.count;
            }
        }
        return count;
    }

    showDeviceDetialShow(values) {
        if (values && values.length > 0) {
            this.modalContext = [];
            this.modalShow = true;
            this.modalContext = values;
        }
    }

    showTags(values) {
        console.log("showTags", values);
        var tags = [];
        for (let value of values) {
            tags.push(this.tagItem.filter(m => m.id == value)[0].text);
        }
        console.log("tags", tags);
        return tags.join(",");
    }

    showOfficeHour(value) {
        console.log("showOfficeHour", value);
        return this.officeHourItem.filter(m => m.id == value)[0]
            ? this.officeHourItem.filter(m => m.id == value)[0].text
            : "";
    }

    showManager(value) {
        console.log("showManager", value);
        return this.managerItem.filter(m => m.id == value)[0]
            ? this.managerItem.filter(m => m.id == value)[0].text
            : "";
    }

    showTime(value) {
        return value
            ? "YYYY-MM-DD" //Datetime.DateTime2String(new Date(value), "YYYY-MM-DD") //TODO fix it
            : "";
    }

    ISiteList() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                */
                customId: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                */
                establishment: any;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                */
                manager: string;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                */
                staffNumber: number;

                /**
                * @uiLabel - ${this._("w_Site_Area")}
                */
                areaName: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                 /**
                * @uiLabel -
                */
                Actions: any;

            }`;
    }

    ISiteFrom() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                * @uiPlaceHolder - ${this._("w_Site_SiteID")}
                * @uiType - iv-form-string
                */
                customId: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                * @uiPlaceHolder - ${this._("w_Site_SiteName")}
                * @uiType - iv-form-string
                */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                * @uiPlaceHolder - ${this._("w_Site_Address")}
                * @uiType - iv-form-string
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_PhoneNumber")}
                * @uiPlaceHolder - ${this._("w_Site_PhoneNumber")}
                * @uiType - iv-form-string
                */
                phone?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                * @uiPlaceHolder - ${this._("w_Site_Establishment")}
                * @uiType - iv-form-date
                */
                establishment?: any;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                * @uiPlaceHolder - ${this._("w_Site_StaffNumber")}
                * @uiType - iv-form-number
                */
                staffNumber: number;

                /**
                * @uiLabel - ${this._("w_Site_OfficeHour")}
                * @uiPlaceHolder - ${this._("w_Site_OfficeHour")}
                */
                officeHour: any;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                * @uiPlaceHolder - ${this._("w_Site_Manager")}
                */
                managerId: any;

                /**
                * @uiLabel - ${this._("w_Site_Tag")}
                * @uiPlaceHolder - ${this._("w_Site_Tag")}
                */
                tag: any;

                /**
                * @uiLabel - ${this._("w_Site_Photo")}
                * @uiPlaceHolder - ${this._("w_Site_Photo")}
                * @uiType - iv-form-file
                */
                sitePhoto?: string;

                imageSrc?:any;

                /**
                * @uiLabel - ${this._("w_Site_Latitude")}
                * @uiPlaceHolder - ${this._("w_Site_Latitude")}
                * @uiType - iv-form-number
                * @uiColumnGroup - location
                */
                latitude?: number;

                /**
                * @uiLabel - ${this._("w_Site_Longitude")}
                * @uiPlaceHolder - ${this._("w_Site_Longitude")}
                * @uiType - iv-form-number
                * @uiColumnGroup - location
                */
                longitude?: number;

                 /**
                * @uiColumnGroup - btuuon
                */
                mapping?: any;

                googleMap?:any;

            }`;
    }

    ISiteView() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                 * @uiType - iv-form-label
                */
                customId?: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                * @uiType - iv-form-label
                */
                name?: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                * @uiType - iv-form-label
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_PhoneNumber")}
                * @uiType - iv-form-label
                */
                phone?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                */
                establishment?: any;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                * @uiType - iv-form-label
                */
                staffNumber?: string;

                /**
                * @uiLabel - ${this._("w_Site_OfficeHour")}
               * @uiType - iv-form-label
                */
                officeHour?: string;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                * @uiType - iv-form-label
                */
                managerId?: string;

                /**
                * @uiLabel - ${this._("w_Site_Tag")}
                * @uiType - iv-form-label
                */
                tag?: string;

                imageSrc:any;

                /**
                * @uiLabel - ${this._("w_Site_Latitude")}
                * @uiType - iv-form-label
                * @uiColumnGroup - location
                */
                latitude?: number;

                /**
                * @uiLabel - ${this._("w_Site_Longitude")}
                * @uiType - iv-form-label
                * @uiColumnGroup - location
                */
                longitude?: number;

                googleMap:any;

            }`;
    }

    IAreaList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName: any;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                Actions: any;
            }`;
    }

    IAreaFrom() {
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
                areaPhoto?: string;

                imageSrc?:any;

                 /**
                * @uiLabel - ${this._("w_Site_MapPhoto")}
                * @uiPlaceHolder - ${this._("w_Site_MapPhoto")}
                * @uiType - iv-form-file
                */
                mapPhoto?: string;

                imageMap?:any;
            }`;
    }

    IAreaView() {
        return `interface {

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 * @uiType - iv-form-label
                 */
                siteName: any;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                imageSrc:any;

                imageMap?:any;


            }`;
    }

    IDeviceList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName: string;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                areaName: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                /**
                * @uiLabel - ${this._("w_Site_Devices")}
                */
                devices: string;
            }`;
    }

    IDeviceFrom() {
        return `interface {

                /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName?: any;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                areaName?: any;

                /**
                 * @uiLabel - ${this._("w_Site_GroupName")}
                 * @uiPlaceHolder - ${this._("w_Site_GroupName")}
                 * @uiType - iv-form-string
                 */
                deviceGroupName?: string;

                /**
                 * @uiLabel - ${this._("w_Site_DeviceType")}
                 * @uiPlaceHolder - ${this._("w_Site_DeviceType")}
                 * @uiType - iv-form-selection
                 */
                deviceType?: ${toEnumInterface(
                    this.deviceTypeItem as any,
                    false
                )};

                /**
                * @uiLabel - ${this._("w_Site_DeviceName")}
                * @uiPlaceHolder - ${this._("w_Site_DeviceName")}
                */
                deviceName?: any;

            }`;
    }

    IDeviceView() {
        return `interface {

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 * @uiType - iv-form-label
                 */
                siteName?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 * @uiType - iv-form-label
                 */
                areaName?: string;

                  /**
                 * @uiLabel - ${this._("w_Site_GroupName")}
                 * @uiType - iv-form-label
                 */
                deviceGroupName?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_DeviceType")}
                 * @uiType - iv-form-label
                 */
                deviceType?: string;

                /**
                 * @uiLabel - ${this._("w_Site_DeviceName")}
                 * @uiType - iv-form-label
                 */
                deviceName?: string;

            }`;
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        console.log("newImgSrc", this.newImgSrc);
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
    }

    isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }
}
</script>

<style lang="scss" scoped>
.googleMap {
    padding: 16px;
}
.imgSide {
    max-width: 200px;
    min-width: 200px;
    max-height: none;
    min-height: auto;
    height: 100%;
    margin-bottom: 10px;
}

.demo-control-row-view {
    width: 98%;
    .demo-control-view {
        margin: 10px;
    }
}
</style>


