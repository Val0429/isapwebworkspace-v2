<template>
	<div>

		<iv-auto-transition
			:step="transition.step"
			:type="transition.type"
		>

			<iv-card
				key="transition_1"
				v-show="transition.step === 1"
				:label="_('w_ReportFilterConditionComponent_')"
			>
				<iv-form
					:interface="IFilterConditionForm()"
					@update:*="tempSaveInputData($event)"
					@submit="doSubmit($event)"
				>

					<template #isAnyTime="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_Sites1') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="isAnytime"
								name="ifAllSites"
								class="mb-3"
								:options="isAnyTimeSelectItem"
								@change="changeTimeSelect"
							></b-form-radio-group>
						</b-col>

					</template>


					<template #ifAllSites="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_Sites1') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="selectAllSites"
								name="ifAllSites"
								class="mb-3"
								:options="ifAllSitesSelectItem"
								@change="changeAllSitesSelect"
							></b-form-radio-group>
						</b-col>

					</template>

					<template #siteIds="{$attrs, $listeners}">

						<iv-form-selection
							v-on="$listeners"
							v-model="inputFormData.siteIds"
							class="select-site ml-3"
							:options="sitesSelectItem"
							:multiple="true"
							@input="changeSiteIds"
						>
						</iv-form-selection>

						<div class="ml-3 mb-3">
							<b-button
								variant="outline-secondary"
								@click="pageToChooseTree"
							>
								{{ _('w_SelectSiteTree') }}
							</b-button>
						</div>

					</template>








					<template #ifAllAreas="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_Area1') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="isAllArea"
								name="ifAllAreas"
								class="mb-3"
								:options="ifAllAreasSelectItem"
								@change="changeAllAreasSelect"
							></b-form-radio-group>
						</b-col>

					</template>

					<template #areaIds="{$attrs, $listeners}">

						<iv-form-selection
							v-on="$listeners"
							v-model="inputFormData.siteIds"
							class="select-area ml-3"
							:options="areaSelectItem"
							:multiple="true"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

					<template #ifAllGroups="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_DeviceGroup1') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="isAllGroup"
								name="ifAllGroups"
								class="mb-3"
								:options="ifAllGroupsSelectItem"
								@change="changeAllGroupsSelect"
							></b-form-radio-group>
						</b-col>

					</template>

					<template #groupIds="{$attrs, $listeners}">

						<iv-form-selection
							v-on="$listeners"
							v-model="inputFormData.siteIds"
							class="select-area ml-3"
							:options="deviceGroupSelectItem"
							:multiple="true"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

					<template #ifAllDevice="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_Devices1') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="isAllDevice"
								name="ifAllDevice"
								class="mb-3"
								:options="ifAllDeviceSelectItem"
								@change="changeAllDevicesSelect"
							></b-form-radio-group>
						</b-col>

					</template>

					<template #deviceIds="{$attrs, $listeners}">

						<iv-form-selection
							v-on="$listeners"
							v-model="inputFormData.siteIds"
							class="select-area ml-3"
							:options="deviceSelectItem"
							:multiple="true"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

				</iv-form>

				<template #footer>
					<b-button
						class="submit"
						size="lg"
						@click="doSubmit"
					>
						{{ _('wb_Submit') }}
					</b-button>

					<b-button
						class="reset"
						size="lg"
						@click="doReset"
					>
						{{ _('wb_Reset') }}
					</b-button>
				</template>

			</iv-card>

			<region-tree-select
				key="transition_2"
				v-show="transition.step === 2"
				:multiple="true"
				:regionTreeItem="regionTreeItem"
				:selectType="selectType"
				:selecteds="selecteds"
				v-on:click-back="pageToShowResult"
			>
			</region-tree-select>

		</iv-auto-transition>

	</div>
</template>


<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	// Transition
	import Transition from "@/services/Transition";
	import { ITransition } from "@/services/Transition";

	// Region Tree
	import {
		ERegionType,
		IRegionTreeSelected,
		RegionTreeItem
	} from "@/components/RegionTree";

	// Report
	import {
		EIfAllSelected,
		ETimeMode,
        EIncludedEmployee,
	} from "@/components/Reports";

	import { ERunTimeType } from '@/components/RuleAndActions'

	// Service
	import Datetime from "@/services/Datetime";
	import Dialog from "@/services/Dialog";
	import { toEnumInterface } from "../../../core";
	import ResponseFilter from '@/services/ResponseFilter';
	import RegionAPI from '@/services/RegionAPI';

	@Component({
		components: {}
	})
	export class ChooseMetrics extends Vue {

		@Prop({
			type: String, // Boolean, Number, String, Array, Object
			default: ""
		})
		deviceMode: string;


		// select 相關
		sitesSelectItem: any = [];
		ifAllSitesSelectItem: any = [];
		ifAllAreasSelectItem: any = [];
		ifAllGroupsSelectItem: any = [];
		ifAllDeviceSelectItem: any = [];

		isActiveSelectItem: any = {};

		isAnyTimeSelectItem: any = [];

		areaSelectItem: any = [];
		deviceGroupSelectItem: any = [];
		deviceSelectItem: any = [];

		transition: ITransition = {
			type: Transition.type,
			prevStep: 1,
			step: 1
		};

		// radio button 相關
		selectAllSites: string = EIfAllSelected.select;
		isAnyTime: string = ERunTimeType.anyTime;
		isAllArea: string = EIfAllSelected.select;
		isAllGroup: string = EIfAllSelected.select;
		isAllDevice: string = EIfAllSelected.select;

		// tree
		selectType = ERegionType.site;
		regionTreeItem = new RegionTreeItem();
		selecteds: IRegionTreeSelected[] = [];


		inputFormData: any = {
			siteIds: [],
			allSiteIds: [],
			firstSiteId: '',
			isActive: EIncludedEmployee.yes,
			areaIds: [],
			groupIds: [],
			deviceIds: [],
		};


		created() {
			// no api
			this.initSelectItem();
			this.initRegionTreeSelect();

			// api
			this.initSelectItemSite();
			this.initSelectItemTree();

		}

		mounted() {

		}


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
				{ value: EIfAllSelected.select, text: this._("w_SelectDeviceGroups") }
			];
			this.ifAllDeviceSelectItem = [
				{ value: EIfAllSelected.all, text: this._("w_AllDevices") },
				{ value: EIfAllSelected.select, text: this._("w_SelectDevice") }
			];

			this.isAnyTimeSelectItem = [
				{ value: ERunTimeType.anyTime, text: this._("w_RuleAndActions_Anytime") },
				{ value: ERunTimeType.startAndEnd, text: this._("w_RuleAndActions_DesignationTime") }
			];

			this.isActiveSelectItem = {
				yes: this._("w_yes"),
				no: this._("w_no")
			};
		}

		initRegionTreeSelect() {
			this.regionTreeItem = new RegionTreeItem();
			this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
		}

		async initSelectItemSite() {

			const readAllSiteParam: {
				type: string;
			} = {
				type: "all"
			};

			await this.$server
				.R("/location/site/all", readAllSiteParam)
				.then((response: any) => {
					if (response != undefined) {
						for (const returnValue of response) {
							// 自定義 sitesSelectItem 的 key 的方式
							let site = { id: returnValue.objectId, text: returnValue.name };
							this.sitesSelectItem.push(site);
						}
					}
				})
				.catch((e: any) => {
					return ResponseFilter.catchError(this, e);
				});

			for (const detail of this.sitesSelectItem) {
				this.inputFormData.allSiteIds.push(detail.id);
			}
		}


		async initSelectItemTree() {
			await this.$server
				.R("/location/tree")
				.then((response: any) => {
					if (response != undefined) {
						this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
							response
						);
						this.regionTreeItem.region = this.regionTreeItem.tree;
					}
				})
				.catch((e: any) => {
					return ResponseFilter.catchError(this, e);
				});
		}

		// Author: Tina
		async initSelectItemArea() {

			this.areaSelectItem = [];

			this.inputFormData.firstSiteId = this.inputFormData.siteIds[0];

			const readParam: {
				siteId: string;
			} = {
				siteId: this.inputFormData.firstSiteId
			};

			if (!this.inputFormData.firstSiteId) {
				return false;
			} else {
				await this.$server
					.R("/location/area/all", readParam)
					.then((response: any) => {
						if (response != undefined) {
							for (const returnValue of response) {
								// 自定義 sitesSelectItem 的 key 的方式
								let area = { id: returnValue.objectId, text: returnValue.name };
								this.areaSelectItem.push(area);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			}
		}

		// Author: Tina
		async initSelectItemDeviceGroup() {
			this.deviceGroupSelectItem = [];

			let readParam: {
				siteId: string;
				areaId?: string;
				mode: string;
			} = {
				siteId: this.inputFormData.firstSiteId,
				mode: this.deviceMode
			};
			if (!this.inputFormData.firstSiteId) {
				return false;

				// 只選擇site
			} else if (this.inputFormData.firstSiteId && !this.inputFormData.areaId) {
				await this.$server
					.R("/device/group/all", readParam)
					.then((response: any) => {
						if (response != undefined) {
							for (const returnValue of response) {
								let group = { id: returnValue.objectId, text: returnValue.name };
								this.deviceGroupSelectItem.push(group);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
				// 選擇site和單一area
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId !== "all"
			) {
				readParam.areaId = this.inputFormData.areaId;
				await this.$server
					.R("/device/group/all", readParam)
					.then((response: any) => {
						if (response != undefined) {
							for (const returnValue of response) {
								let group = { id: returnValue.objectId, text: returnValue.name };
								this.deviceGroupSelectItem.push(group);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
				// 選擇site和all area
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId === "all"
			) {
				await this.$server
					.R("/device/group/all", readParam)
					.then((response: any) => {
						if (response != undefined) {
							for (const returnValue of response) {
								let group = { id: returnValue.objectId, text: returnValue.name };
								this.deviceGroupSelectItem.push(group);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			}
		}

		// Author: Tina
		async initSelectItemDevice() {
			this.deviceSelectItem = [];

			const readParam: {
				siteId: string;
				areaId?: string;
				groupId?: string;
				mode: string;
			} = {
				siteId: this.inputFormData.firstSiteId,
				mode: this.deviceMode
			};
			if (!this.inputFormData.firstSiteId) {
				return false;
			} else if (
				this.inputFormData.firstSiteId &&
				!this.inputFormData.areaId &&
				!this.inputFormData.groupId
			) {
				// 只選擇site
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId !== "all" &&
				!this.inputFormData.groupId
			) {
				// 選擇site和單一area
				readParam.areaId = this.inputFormData.areaId;
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId !== "all" &&
				this.inputFormData.groupId &&
				this.inputFormData.groupId !== "all"
			) {
				// 選擇site和單一area和單一device group
				readParam.groupId = this.inputFormData.groupId;
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
						if (response.results.length === 0) {
							this.deviceSelectItem = {};
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId !== "all" &&
				this.inputFormData.groupId &&
				this.inputFormData.groupId !== "all" &&
				this.inputFormData.deviceId === "all"
			) {
				// 選擇site和單一area和單一device group和 all device
				readParam.groupId = this.inputFormData.groupId;

				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
						if (response.results.length === 0) {
							this.deviceSelectItem = {};
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId === "all" &&
				(this.inputFormData.groupId === undefined ||
					this.inputFormData.groupId === "") &&
				this.inputFormData.groupId !== "all"
			) {
				// 選擇site和all area
				readParam.areaId = "";
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId === "all" &&
				this.inputFormData.groupId &&
				this.inputFormData.groupId === "all"
			) {
				// 選擇site和all area和all device group
				readParam.groupId = this.inputFormData.groupId;
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
						if (response.results.length === 0) {
							this.deviceSelectItem = {};
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			} else if (
				this.inputFormData.firstSiteId &&
				this.inputFormData.areaId &&
				this.inputFormData.areaId !== "all" &&
				this.inputFormData.groupId &&
				this.inputFormData.groupId === "all"
			) {
				// 選擇site和單一area和all device group
				readParam.areaId = this.inputFormData.areaId;
				readParam.groupId = "";
				await this.$server
					.R("/device", readParam)
					.then((response: any) => {
						if (response.results.length > 0) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
						if (response.results.length === 0) {
							this.deviceSelectItem = {};
						}
					})
					.catch((e: any) => {
						return ResponseFilter.catchError(this, e);
					});
			}
		}

		tempSaveInputData(data) {
			switch (data.key) {
				case "tagIds":
					this.inputFormData.tagIds = data.value;
					break;
				case "startDate":
					this.inputFormData.startDate = data.value;
					break;
				case "endDate":
					this.inputFormData.endDate = data.value;
					break;
				case "designationPeriod":
					this.inputFormData.designationPeriod = data.value;
					break;
			}
		}

		changeTimeSelect(selected: string) {
			this.isAnyTime = selected
		}

		changeAllSitesSelect(selected: string) {
			this.inputFormData.siteIds = [];
			this.selecteds = [];
			this.selectAllSites = selected;

			if (this.selectAllSites === EIfAllSelected.all) {
				this.inputFormData.siteIds = [];
				this.selecteds = [];

				this.inputFormData.siteIds = this.inputFormData.allSiteIds;
			} else {
				this.inputFormData.siteIds = [];
				this.selecteds = [];
			}
		}


		changeAllAreasSelect(selected: string) {
			this.isAllArea = selected;
		}

		changeAllGroupsSelect(selected: string) {
			this.isAllGroup = selected;

		}

		changeAllDevicesSelect(selected: string) {
			this.isAllDevice = selected;

		}

		changeSiteIds() {
			if (
				this.inputFormData.siteIds.length !==
				this.inputFormData.allSiteIds.length
			) {
				this.selectAllSites = EIfAllSelected.select;
			} else if (
				this.inputFormData.siteIds.length ===
				this.inputFormData.allSiteIds.length
			) {
				this.selectAllSites = EIfAllSelected.all;
			}

			this.selecteds = [];

			for (const id of this.inputFormData.siteIds) {
				for (const detail of this.sitesSelectItem) {
					if (id === detail.id) {
						let selectedsObject: IRegionTreeSelected = {
							objectId: detail.id,
							type: ERegionType.site,
							name: detail.text
						};
						this.selecteds.push(selectedsObject);
					}
				}
			}
		}

		async pageToChooseTree() {
			this.transition.prevStep = this.transition.step;
			this.transition.step = 2;

			this.selecteds = [];

			for (const id of this.inputFormData.siteIds) {
				for (const detail of this.sitesSelectItem) {
					if (id === detail.id) {
						let selectedsObject: IRegionTreeSelected = {
							objectId: detail.id,
							type: ERegionType.site,
							name: detail.text
						};
						this.selecteds.push(selectedsObject);
					}
				}
			}
		}

		pageToShowResult() {
			this.transition.prevStep = this.transition.step;
			this.transition.step = 1;

			// siteIds clear
			this.inputFormData.siteIds = [];

			// from selecteds push siteIds
			for (const item of this.selecteds) {
				this.inputFormData.siteIds.push(item.objectId);
			}

			if (
				this.inputFormData.siteIds.length !==
				this.inputFormData.allSiteIds.length
			) {
				this.selectAllSites = EIfAllSelected.select;
			} else if (
				this.inputFormData.siteIds.length ===
				this.inputFormData.allSiteIds.length
			) {
				this.selectAllSites = EIfAllSelected.all;
			}
		}

		async doSubmit() {
			const doSubmitParam: {
				startDate: Date;
				endDate: Date;
				firstSiteId?: string;
				siteIds: string[];
				tagIds: string[];
				type: ETimeMode;
			} = {
				startDate: Datetime.DateToZero(new Date()),
				endDate: Datetime.DateToZero(new Date()),
				type: ETimeMode.none,
				firstSiteId: "",
				siteIds: [],
				tagIds:
					this.inputFormData.tagIds === []
						? []
						: this.inputFormData.tagIds
			};


			if (this.inputFormData.siteIds.length === 0) {
				Dialog.error(this._("w_PleaseSelectSites"));
				return false;
			}

			if (this.selectAllSites === "all") {
				this.inputFormData.siteIds = this.inputFormData.allSiteIds;
			}

			doSubmitParam.siteIds = this.inputFormData.siteIds;
			doSubmitParam.firstSiteId = doSubmitParam.siteIds[0];


			// return false;
			this.$emit("submit-data", doSubmitParam);
		}

		doReset() {
			this.inputFormData = {
				siteIds: [],
				tagIds: [],
				allSiteIds: [],
				startDate: new Date(),
				endDate: new Date(),
				designationPeriod: "today"
			};

			this.selectAllSites = EIfAllSelected.select;

		}

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
                isActive: ${toEnumInterface(this.isActiveSelectItem as any, false)};


                /**
                 * @uiColumnGroup - isAnytime
                 */
                isAnytime?: any;


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


            }
        `;
		}
	}

	export default ChooseMetrics;
	Vue.component("choose-metrics", ChooseMetrics);
</script>

<style lang="scss" scoped>
	.select_report_period_button {
		margin-top: 27px;
		margin-bottom: 16px;
	}

	.select-site {
		width: 89%;
	}

	.tree {
		background-color: #fff;
		border: 1px solid #d1d1d1;
		color: #bbb;
	}

	.select_date_button {
		margin-top: 29px;
	}
	.submit {
		background-color: #5c7895;
		border: 1px solid #5c7895;
	}
	.reset {
		background-color: #d7d7d7;
		border: 1px solid #d7d7d7;
	}


	.select-area {
		width: 98%;
	}
</style>
