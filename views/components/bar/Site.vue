<template>
    <div class="animated fadeIn">
        <!--Site List-->
        <div v-show="pageStep === ePageStep.siteList">
            <iv-card :label="_('w_Filter')">
                <iv-form 
                    ref="filterForm"
                    class="col-md-9"
                    @mounted="doMounted"
                    :interface="filterInterface()"            
                    :value="getParams"                            
                    @submit="onFilter($event)">            
                    </iv-form> 
                <template v-if="isMounted" >            
                    <div class="float-right">
                        <b-button class="btn-filter" size="lg" v-bind="$refs.filterForm.submitBindings.$attrs" v-on="$refs.filterForm.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                        <b-button class="btn-filter" size="lg" v-bind="$refs.filterForm.resetBindings.$attrs" v-on="$refs.filterForm.resetBindings.$listeners" @click="getParams={}">{{ _("wb_Reset") }}</b-button>                
                    </div>
                </template>
            </iv-card>   
            <iv-card :label="_('w_Site_SiteList')">

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="!isSelectSite"
                        @click="pageToSiteView()"
                    />
                    <iv-toolbox-edit v-show="canEdit"
                        :disabled="!isSelectSite"
                        @click="pageToSiteEdit()"
                    />
                    <iv-toolbox-delete v-show="canDelete"
                        :disabled="!isSelectSite"
                        @click="deleteSite()"
                    />

                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToSiteAdd()" v-show="canAdd"/>

                </template>
            
                <iv-table
                    ref="siteTable"
                    :interface="ISiteList()"
                    @selected="selectedSite($event)"
                    :server="{ path: '/location/site' }"
                    :params="getParams"
                    :multiple="tableMultiple"
                >
                    <template #regionname="{$attrs, $listeners}">
                        {{$attrs.row.region ? $attrs.row.region.name: ''}}
                    </template>

                    <template #Actions="{$attrs, $listeners}">                        
                            <iv-toolbox-area :disabled="!isSelectSite"
                            @click="pageToAreaList($attrs.row)" />                        
                    </template>
                </iv-table>

            </iv-card>
        </div>

        <!--Site Form (Add and Edit)-->
        <div v-if="pageStep === ePageStep.siteAdd || pageStep === ePageStep.siteEdit">
            <iv-auto-card :label="pageStep == ePageStep.siteAdd ? _('w_Site_AddSite') :  _('w_Site_EditSite')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToSiteList()" />
                </template>

                <iv-form
                    :interface="ISiteForm()"
                    :value="site"
                    @update:*="updateSiteForm($event)"
                    @submit="saveSite($event)"
                >


                    <template #imageSrc="{ $attrs, $listeners}">
                        <img
                            class="imgSide"
                            v-if="newImgSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :src="newImgSrc"
                        />
                    </template>
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToSiteList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

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
        <div v-show="pageStep === ePageStep.areaList">
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
                    v-if="isSelectSite && areaParams.siteId"
                    @selected="selectedArea($event)"
                    :interface="IAreaList()"
                    :multiple="tableMultiple"
                    :server="{  path: '/location/area' }"
                    :params="areaParams"
                >

                    <template #siteName="{$attrs, $listeners}">
                        {{$attrs.row.site ? $attrs.row.site.name : ""}}
                    </template>

                    
                </iv-table>

            </iv-card>
        </div>

        <!--Area Form (Add and Edit)-->
        <div v-if="pageStep === ePageStep.areaAdd || pageStep === ePageStep.areaEdit">
            <iv-auto-card :label="pageStep == ePageStep.areaAdd ? _('w_Site_AddArea') :  _('w_Site_EditArea')">
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
                            v-if="areaPhotoSrc || area.imageSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :src="areaPhotoSrc || (serverUrl +area.imageSrc)"
                        />
                    </template>

                    <template #imageMap="{ $attrs, $listeners}">
                        <div class="card-content iv-form-group col-md-12">
                            <img
                            class="imgSide"
                            v-if="imageMap || area.mapSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :src="imageMap || (serverUrl + area.mapSrc)"
                            />
                           
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

                    <template #mapSrc="{ $attrs, $listeners}">                       
                        <div class="col-md-12">
                            <img
                            class="imgSide"
                            v-if="area.mapSrc"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-bind:src="serverUrl+area.mapSrc"
                        />
                        </div>
                    </template>

                </iv-form>

                <template #footer>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToAreaList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>
        </div>
    </div>

</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ImageBase64 from "@/services/ImageBase64";
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog/Dialog";
import Datetime from "@/services/Datetime";
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
    IAreaEditData
} from "@/config/default/api/interfaces";
import { PermissionName} from '@/../src/constants/permissions';

enum EPageStep {
    siteList = "siteList",
    siteView = "siteView",
    siteAdd = "siteAdd",
    siteEdit = "siteEdit",

    areaList = "areaList",
    areaView = "areaView",
    areaAdd = "areaAdd",
    areaEdit = "areaEdit",

    none = "none"
}



@Component({
    components: {}
})
export default class Site extends Vue {
    beforeMount(){
        if(!this.$user || !this.$user.permissions)return;
        this.permissionName = PermissionName.site;
        this.canAdd = this.$user.permissions.find(x=>x.access.C === true && x.of.identifier == this.permissionName) != undefined;
        this.canEdit = this.$user.permissions.find(x=>x.access.U === true && x.of.identifier == this.permissionName) != undefined;
        this.canDelete = this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined;        
    }
    canAdd:boolean;
    canEdit:boolean;
    canDelete:boolean;
    permissionName:string;

    serverUrl = ServerConfig.url;
    newImg = new Image();
    newImgSrc = "";
    tableMultiple = false;
    ePageStep = EPageStep;
    lastPageStep: EPageStep = EPageStep.none;
    pageStep: EPageStep = EPageStep.none;
    imageMap = "";
    isMounted = false;    

    //site datas
    isSelectSite = false;
    sites = {};
    site: any = {};

    //area datas
    isSelectArea = false;
    areaPhotoSrc = "";
    areaMapSrc = "";
    areas = {};
    area: any = {};
    areaParams:any={};

    //options
    managerItem = [];
    tagItem = [];
    officeHourItem = [];
    areaNameItem = [];
    cameraModeItem = [];

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

    filterInterface(){
        return ` interface {
            /**
             * @uiLabel - ${this._("w_Region")}
             * @uiColumnGroup - row1
            */
            regionname?:string;
            /**
             * @uiLabel - ${this._("w_Site")}
             * @uiColumnGroup - row1
            */
            sitename?:string;
        }
        
        `;
    }
    onFilter($event){
        this.getParams=$event;        
    }
    doMounted(){
        this.isMounted=true;
    }
    pageToAreaList(site?:any) {
        this.pageStep = EPageStep.areaList;
        if(site){
            this.site = site;
            this.areaParams = {
                siteId: site.objectId
            };                    
        }
        else{        
            (this.$refs.areaTable as any).reload();
        }
    }

    pageToAreaView() {
        console.log("pageToAreaView", this.area);
        this.areaPhotoSrc = this.serverUrl + this.area.imageSrc;
        this.areaMapSrc = this.serverUrl + this.area.mapSrc;
        //this.imageMap= ImageBase64.pngEmpty;
        this.pageStep = EPageStep.areaView;
    }

    pageToAreaAdd() {
        this.clearAreaData();
        this.areaMapSrc = ImageBase64.pngEmpty;
        this.imageMap = ImageBase64.pngEmpty;
        this.pageStep = EPageStep.areaAdd;
    }
    selectedArea(data) {
        console.log("selectedArea", data);
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        if (data) {
            this.area = this.isSelectArea = data;            
        } else {
            this.clearAreaData();
        }
    }
    pageToAreaEdit() {
        this.areaMapSrc = this.serverUrl + this.area.mapSrc;
        this.pageStep = EPageStep.areaEdit;
    }

    getParams:any={};
 

   
    



    pageToSiteList() {
        this.clearAreaData();
        this.pageStep = EPageStep.siteList;
        (this.$refs.siteTable as any).reload();
    }

    pageToSiteView() {
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
        this.pageStep = EPageStep.siteView;
    }

    pageToSiteAdd() {
        this.clearSiteData();
        this.pageStep = EPageStep.siteAdd;
    }

    pageToSiteEdit() {
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
        this.pageStep = EPageStep.siteEdit;
    }
    

    async saveSite(data) {
        console.log("saveSite", data);

        if (this.pageStep == EPageStep.siteAdd) {
            const datas: ISiteAddData[] = [
                {
                    // regionId: "uCsinPqUj1",
                    name: data.name,
                    address: data.address,
                    longitude: data.longitude,
                    latitude: data.latitude
                }
            ];

            const addSiteParam = { datas };

            await this.$server
                .C("/location/site" as any, addSiteParam)
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
                    address: data.address,
                    longitude: data.longitude,
                    latitude: data.latitude
                }
            ];

            const editSiteParam = { datas };

            await this.$server
                .U("/location/site" as any, editSiteParam)
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
    }

    async saveArea(data) {
        console.log("saveArea", data);

        if (this.pageStep == EPageStep.areaAdd) {
            const datas: IAreaAddData[] = [
                {
                    siteId: this.site.objectId,
                    name: data.name,
                    imageBase64: this.areaPhotoSrc,
                    mapBase64: this.imageMap
                }
            ];

            const addAreaParam = { datas };

            await this.$server
                .C("/location/area" as any, addAreaParam)
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
                datas[0].mapBase64 = this.imageMap;
            }

            const editAreaParam = { datas };

            await this.$server
                .U("/location/area" as any, editAreaParam)
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
                objectId: this.site.objectId
            };
            this.$server
                .D("/location/site" as any, body)
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
                objectId: this.area.objectId
            };
            this.$server
                .D("/location/area" as any, body)
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


    

    updateSiteForm(data) {
        console.log("updateSiteForm", data);
        if (data) {
            this.site[data.key] = data.value;
            if (data.key == "sitePhoto") {
                this.uploadFile(data.value);
            }
        }
    }

    async updateAreaForm(data) {
        console.log("updateAreaForm", data);
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
                    this.imageMap = this.newImg.src;                    
                }, 300);
            }
        }
    }
    selectedSite(data) {
        console.log("selectedSite", data);
        this.newImgSrc = "";
        if (data) {            
            this.site = data;
            this.isSelectSite = true;            
        } else {
            this.clearSiteData();
        }
    }

    pageSize(data) {
        console.log("pageSize", data);
    }


    clearAreaData() {
        this.isSelectArea = false;
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        this.area = {};
    }

    clearSiteData() {
        this.isSelectSite = false;
        this.newImgSrc = "";
        this.site = {};
    }

    showFirst(data): string {
        if (data.length >= 2) {
            return data.map(item => item)[0] + "...";
        }
        if (data.length === 1) {
            return data.map(item => item)[0];
        }
        if (data.length == 0) {
            return "";
        }
    }

    

    

    

    ISiteList() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Region")}
                */
                regionname: string;
                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                */
                name: string;

                /**
                * @uiLabel - ${this._("w_Area_Count")}
                */
                areaCount?: number;

                /**
                * @uiLabel - ${this._("w_DoorGroup_Count")}
                */
                doorGroupCount?: number;

                /**
                * @uiLabel - ${this._("w_Door_Count")}
                */
                doorCount?: number;
                /**
                * @uiLabel - ${this._("w_Reader_Count")}
                */
                readerCount?: number;
                /**
                * @uiLabel - ${this._("w_Action")}
                */
                Actions: any;
            }`;
    }

    ISiteForm() {
        return `interface {            

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
            }`;
    }

    ISiteView() {
        return `interface {
            

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
            }`;
    }

    IAreaList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_Number")}
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

            }`;
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

                mapSrc?:any;


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


