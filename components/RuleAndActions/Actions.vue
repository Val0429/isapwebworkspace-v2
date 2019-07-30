<template>
    <iv-form :interface="IFilterConditionForm()">

    </iv-form>
</template>

<script lang="ts">
<<<<<<< HEAD
	import { Component, Prop, Vue } from "vue-property-decorator";

	import { ERunTimeType } from '@/components/RuleAndActions'

	// Service
	import { toEnumInterface } from "../../../core";
	import ResponseFilter from '@/services/ResponseFilter';
	import RegionAPI from '@/services/RegionAPI';

	@Component({
		components: {}
	})
	export class Actions extends Vue {

		@Prop({
			type: String, // Boolean, Number, String, Array, Object
			default: ""
		})
		deviceMode: string;


		// select 相關
		// radio button
		ifAllSitesSelectItem: any = [];
		ifAllAreasSelectItem: any = [];
		ifAllGroupsSelectItem: any = [];
		ifAllDeviceSelectItem: any = [];
		isAnyTimeSelectItem: any = [];



		inputFormData: any = {
			name: '',

		};


		created() {
			// no api
			this.initSelectItem();

		}

		mounted() {

		}


		initSelectItem() {
			// this.ifAllSitesSelectItem = [
			// 	{ value: EIfAllSelected.all, text: this._("w_AllSites") },
			// 	{ value: EIfAllSelected.select, text: this._("w_SelectSites") }
			// ];

		}
=======
import { Vue, Component, Prop } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";

// Report
import {
    EIfAllSelected,
    ETimeMode,
    EIncludedEmployee
} from "@/components/Reports";

import { ERunTimeType } from "@/components/RuleAndActions";
import { ERegionType } from "../RegionTree";

// Service
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import RegionAPI from "@/services/RegionAPI";

@Component({
    components: {}
})
export class Actions extends Vue {
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    deviceMode: string;

    // select 相關
    // radio button
    ifAllSitesSelectItem: any = [];
    ifAllAreasSelectItem: any = [];
    ifAllGroupsSelectItem: any = [];
    ifAllDeviceSelectItem: any = [];
    isAnyTimeSelectItem: any = [];

    isActiveSelectItem: any = {};

    // store 相關
    sitesSelectItem: any = [];
    areaSelectItem: any = [];
    deviceGroupSelectItem: any = [];
    deviceSelectItem: any = [];

    // radio button v-modal 相關
    selectAllSites: string = EIfAllSelected.select;
    isAnyTime: string = ERunTimeType.anyTime;
    isAllArea: string = EIfAllSelected.select;
    isAllGroup: string = EIfAllSelected.select;
    isAllDevice: string = EIfAllSelected.select;

    // run time 相關
    runTime: any = {
        startHours: "",
        endHours: "",
        startMinutes: "",
        endMinutes: ""
    };

    runTimeRange = {
        hours: [],
        minutes: []
    };

    anyTime = "Any Time";

    inputFormData: any = {
        name: "",
        siteIds: [],
        allSiteIds: [],
        firstSiteId: "",
        isActive: EIncludedEmployee.yes,
        areaIds: [],
        groupIds: [],
        deviceIds: [],
        allAreaIds: [],
        allGroupIds: [],
        allDeviceIds: [],

        startHours: "10",
        startMinutes: "0",
        endHours: "20",
        endMinutes: "0"
    };

    created() {
        // no api
        this.initSelectItem();
    }

    mounted() {}

    initSelectItem() {
        this.ifAllSitesSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllSites") },
            { value: EIfAllSelected.select, text: this._("w_SelectSites") }
        ];

        this.ifAllAreasSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllAreas") },
            { value: EIfAllSelected.select, text: this._("w_SelectArea") }
        ];

        this.ifAllGroupsSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllDeviceGroups") },
            {
                value: EIfAllSelected.select,
                text: this._("w_SelectDeviceGroups")
            }
        ];
        this.ifAllDeviceSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllDevices") },
            { value: EIfAllSelected.select, text: this._("w_SelectDevice") }
        ];

        this.isAnyTimeSelectItem = [
            {
                value: ERunTimeType.anyTime,
                text: this._("w_RuleAndActions_Anytime")
            },
            {
                value: ERunTimeType.startAndEnd,
                text: this._("w_RuleAndActions_DesignationTime")
            }
        ];

        this.isActiveSelectItem = {
            yes: this._("w_yes"),
            no: this._("w_no")
        };
    }
>>>>>>> cad7dd2d0e7643a469bf070aa2d8bf735ca17037

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_RuleName")}
                 * @uiPlaceHolder - ${this._("w_RuleAndActions_RuleName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Active")}
                 * @uiColumnGroup - row
                 */
<<<<<<< HEAD
                isActive: any;
=======
                isActive: ${toEnumInterface(
                    this.isActiveSelectItem as any,
                    false
                )};
>>>>>>> cad7dd2d0e7643a469bf070aa2d8bf735ca17037


                /**
                 * @uiColumnGroup - isAnytime
                 */
                isAnytime?: any;


                anyTime?: string;


<<<<<<< HEAD
=======
                /**
                 * @uiColumnGroup - analysis
                 */
                startHours?: any;


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_startTime")}
                 * @uiColumnGroup - analysis
                 */
                startMinutes?: any;


                /**
                 * @uiColumnGroup - analysis
                 */
                endHours?: any;


                /**
                 * @uiColumnGroup - analysis
                 */
                endMinutes?: any;


                /**
                 * @uiColumnGroup - ifAllSites
                 */
                ifAllSites?: any;


                /**
                 * @uiColumnGroup - site
                 */
                 siteIds: any;


                /**
                 * @uiColumnGroup - site
                 */
                 selectTree?: any;


                /**
                 * @uiColumnGroup - ifAllAreas
                 */
                ifAllAreas?: any;


                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - analysis
                 */
                areaIds?: ${toEnumInterface(this.areaSelectItem as any, true)};


                /**
                 * @uiColumnGroup - ifAllGroups
                 */
                ifAllGroups?: any;


                /**
                 * @uiLabel - ${this._("w_DeviceGroups")}
                 * @uiColumnGroup - analysis
                 */
                groupIds?: ${toEnumInterface(
                    this.deviceGroupSelectItem as any,
                    true
                )};


                /**
                 * @uiColumnGroup - ifAllDevice
                 */
                ifAllDevice?: any;


                /**
                 * @uiLabel - ${this._("w_Devices")}
                 * @uiColumnGroup - analysis
                 */
                deviceIds?: ${toEnumInterface(
                    this.deviceSelectItem as any,
                    true
                )};

>>>>>>> cad7dd2d0e7643a469bf070aa2d8bf735ca17037
            }
        `;
    }
}

export default Actions;
Vue.component("actions", Actions);
</script>
