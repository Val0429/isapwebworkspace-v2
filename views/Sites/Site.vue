<template>
    <div class="animated fadeIn">
        <!--Site List-->
        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >
            <div
                key="transition_1"
                v-show="transition.step === 1"
            >
                <siteList
                    ref="siteTable"
                    v-on:pageToSiteView="pageToSiteView"
                    v-on:pageToSiteEdit="pageToSiteEdit"
                    v-on:pageToSiteAdd="pageToSiteAdd"
                    v-on:pageToAreaList="pageToAreaList"
                    v-on:pageToDeviceGroupList="pageToDeviceGroupList(1)"
                    v-on:selectedSite="selectedSite"
                ></siteList>
            </div>

            <!--Site Form (Add and Edit)-->
            <div
                key="transition_3_4"
                v-if="transition.step === 3  || transition.step === 4"
            >
                <siteForm
                    :site="site"
                    :transition="transition"
                    v-on:pageToSiteList="pageToSiteList"
                ></siteForm>
            </div>

            <!--Site View-->
            <div
                key="transition_2"
                v-if="transition.step === 2"
            >
                <siteView
                    :site="site"
                    v-on:pageToSiteList="pageToSiteList"
                ></siteView>
            </div>

            <!--Area List-->
            <div
                key="transition_5"
                v-show="transition.step === 5"
            >
                <siteAreaList
                    ref="areaTable"
                    :areaParams="areaParams"
                    v-on:pageToAreaView="pageToAreaView"
                    v-on:pageToAreaEdit="pageToAreaEdit"
                    v-on:pageToAreaAdd="pageToAreaAdd"
                    v-on:pageToSiteList="pageToSiteList"
                    v-on:pageToDeviceGroupList="pageToDeviceGroupList(5)"
                    v-on:selectedArea="selectedArea"
                ></siteAreaList>
            </div>

            <!--Area Form (Add and Edit)-->
            <div
                key="transition_7_8"
                v-if="transition.step === 7  || transition.step === 8"
            >

                <siteAreaForm
                    :site="site"
                    :area="area"
                    :transition="transition"
                    v-on:pageToAreaList="pageToAreaList"
                ></siteAreaForm>

            </div>

            <!--Area View-->
            <div
                key="transition_6"
                v-if="transition.step === 6"
            >
                <SiteAreaView
                    :site="site"
                    :area="area"
                    v-on:pageToAreaList="pageToAreaList"
                ></SiteAreaView>
            </div>

            <!--Device Group List-->
            <div
                key="transition_9"
                v-show="transition.step === 9"
            >
                <siteDeviceGroupList
                    ref="deviceGroupTable"
                    :deviceGroupParams="deviceGroupParams"
                    :transition="transition"
                    v-on:pageToDeviceGroupView="pageToDeviceGroupView"
                    v-on:pageToDeviceGroupEdit="pageToDeviceGroupEdit"
                    v-on:pageToDeviceGroupAdd="pageToDeviceGroupAdd"
                    v-on:pageToSiteList="pageToSiteList"
                    v-on:pageToAreaList="pageToAreaList"
                    v-on:selectedDeviceGroup="selectedDeviceGroup"
                ></siteDeviceGroupList>

            </div>

            <!--Device Form (Add and Edit)-->
            <div
                key="transition_11_12"
                v-if="transition.step === 11 || transition.step === 12"
            >

                <siteDeviceGroupForm
                    :site="site"
                    :area="area"
                    :deviceGroup="deviceGroup"
                    :transition="transition"
                    v-on:pageToDeviceGroupList="deviceGroupParams.siteId ? pageToDeviceGroupList(1) : pageToDeviceGroupList(5)"
                ></siteDeviceGroupForm>

            </div>

            <!--Device View-->
            <div
                key="transition_10"
                v-if="transition.step === 10"
            >

                <SiteDeviceGroupView
                    :site="site"
                    :area="area"
                    :deviceGroup="deviceGroup"
                    v-on:pageToDeviceGroupList="deviceGroupParams.siteId ? pageToDeviceGroupList(1) : pageToDeviceGroupList(5)"
                ></SiteDeviceGroupView>
            </div>
        </iv-auto-transition>

    </div>

</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Service
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

//sunComponent
import { SiteList } from "./SiteList.vue";
import { SiteView } from "./SiteView.vue";
import { SiteForm } from "./SiteForm.vue";
import { SiteAreaList } from "./SiteAreaList.vue";
import { SiteAreaForm } from "./SiteAreaForm.vue";
import { SiteAreaView } from "./SiteAreaView.vue";
import { SiteDeviceGroupList } from "./SiteDeviceGroupList.vue";
import { SiteDeviceGroupForm } from "./SiteDeviceGroupForm.vue";
import { SiteDeviceGroupView } from "./SiteDeviceGroupView.vue";

@Component({
    components: {
        SiteList,
        SiteView,
        SiteForm,
        SiteAreaList,
        SiteAreaForm,
        SiteAreaView,
        SiteDeviceGroupList,
        SiteDeviceGroupForm,
        SiteDeviceGroupView
    }
})
export default class Site extends Vue {
    serverUrl = ServerConfig.url;
    newImg = new Image();
    tableMultiple = false;
    newImgSrc = "";

    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    //site datas
    sites = {};
    site: any = {};
    gooleMapSrc = "";

    //area datas
    isSelectArea = false;
    areaPhotoSrc = "";
    areaMapSrc = "";
    areas = {};
    area: any = {};
    areaParams = {};
    areaAll = [];

    //device Group datas
    isSelectDeviceGroup = false;
    deviceGroups = {};
    deviceGroup: any = {};
    deviceGroupParams = {};
    deviceGroupAll = [];

    //device datas
    devicesGroupDevices = [];
    devicesGroupDevice = {};
    devices = [];
    device = {};

    //options
    managerItem = [];
    tagItem = [];
    officeHourItem = [];
    deviceTypeItem = {};
    deviceNameItem = [];
    areaNameItem = [];
    cameraModeItem = [];

    created() {}

    mounted() {
        this.pageToSiteList();
    }

    pageToSiteList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearAreaData();
        this.clearDeviceGroupData();
        (this.$refs.siteTable as any).reload();
    }

    pageToSiteView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToSiteAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearSiteData();
    }

    pageToSiteEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
    }

    pageToAreaList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 5;
        this.clearDeviceGroupData();
        (this.$refs.areaTable as any).reload();
    }

    pageToAreaView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 6;
    }

    pageToAreaAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 7;
        this.clearAreaData();
    }

    pageToAreaEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 8;
    }

    pageToDeviceGroupList(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 9;
        (this.$refs.deviceGroupTable as any).reload();
    }

    pageToDeviceGroupView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 10;
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
    }

    pageToDeviceGroupAdd(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 11;
        this.clearDeviceGroupData();
    }

    pageToDeviceGroupEdit(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 12;
    }

    selectedSite(data) {
        if (data && data.objectId) {
            this.site = data;

            this.areaParams = {
                siteId: data.objectId
            };
            this.deviceGroupParams = {
                siteId: data.objectId
            };
        } else {
            this.clearSiteData();
        }
    }

    selectedArea(data) {
        if (data && data.objectId) {
            this.area = data;
            this.deviceGroupParams = {
                areaId: data.objectId
            };
        } else {
            this.clearAreaData();
        }
    }

    selectedDeviceGroup(data) {
        if (data && data.objectId) {
            this.deviceGroup = data;
        } else {
            this.clearDeviceGroupData();
        }
    }

    clearAreaData() {
        this.isSelectArea = false;
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        this.area = { high: 0, medium: 0, low: 0 };
    }

    clearSiteData() {
        this.gooleMapSrc = "";
        this.newImgSrc = "";
        this.site = { latitude: 0, longitude: 0 };
    }

    clearDeviceGroupData() {
        this.isSelectDeviceGroup = false;
        this.newImgSrc = "";
        this.deviceGroup = { high: 0, medium: 0, low: 0 };
    }

    pageSize(data) {
        // TODO: do something?
        console.log("pageSize", data);
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


