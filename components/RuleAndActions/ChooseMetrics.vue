<template>
	<div>

		<iv-auto-transition
			:step="transition.step"
			:type="transition.type"
		>

				<iv-form
					key="transition_1"
					v-show="transition.step === 1"
					:interface="IFilterConditionForm()"
					@update:name="updateName($event)"
					@update:isActive="updateActive($event)"
					@update:*="updateTime($event)"
					@submit="doSubmit($event)"
				>

					<template #name="{ $attrs, $listeners }">
						<iv-form-string
							v-bind="$attrs"
							v-on="$listeners"
							v-model="inputFormData.name"
						>
						</iv-form-string>
					</template>


					<template #isActive="{ $attrs, $listeners }">
						<iv-form-selection
							v-bind="$attrs"
							v-on="$listeners"
							v-model="inputFormData.isActive"
						>
						</iv-form-selection>
					</template>


					<!-- run time -->
					<template #isAnytime="{ $attrs, $listeners }">

						<p class="ml-3">{{ _('w_RuleAndActions_Runtime') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-model="isAnyTime"
								name="isAnyTime"
								class="mb-3"
								:options="isAnyTimeSelectItem"
								@change="changeTimeSelect"
							></b-form-radio-group>
						</b-col>
					</template>

					<template #startHours="{$attrs, $listeners}">

						<p class="col-md-1 mt-1" v-if="isAnyTime === 'startAndEnd'"> {{ _('w_RuleAndActions_startTime') }} </p>

						<iv-form-selection
							v-if="isAnyTime === 'startAndEnd'"
							v-on="$listeners"
							v-model="inputFormData.startHours"
							class="col-md-3"
							:options="runTimeRange.hours"
							:multiple="false"
							@input="changeSiteIds"
						>
						</iv-form-selection>
					</template>

					<template #startMinutes="{$attrs, $listeners}">

						<iv-form-selection
							v-if="isAnyTime === 'startAndEnd'"
							v-on="$listeners"
							v-model="inputFormData.startMinutes"
							class="col-md-2"
							:options="runTimeRange.minutes"
							:multiple="false"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

					<template #endHours="{$attrs, $listeners}">

						<p class="col-md-1 mt-1" v-if="isAnyTime === 'startAndEnd'"> {{ _('w_RuleAndActions_endTime') }} </p>

						<iv-form-selection
							v-if="isAnyTime === 'startAndEnd'"
							v-on="$listeners"
							v-model="inputFormData.endHours"
							class="col-md-3"
							:options="runTimeRange.hours"
							:multiple="false"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

					<template #endMinutes="{$attrs, $listeners}">

						<iv-form-selection
							v-if="isAnyTime === 'startAndEnd'"
							v-on="$listeners"
							v-model="inputFormData.endMinutes"
							class="col-md-2"
							:options="runTimeRange.minutes"
							:multiple="false"
							@input="changeSiteIds"
						>
						</iv-form-selection>

					</template>

					<template #anyTime>
						<iv-form-label
							v-if="isAnyTime === 'anyTime'"
							v-model="anyTime"
							class="col-md-12"
						>
						</iv-form-label>
					</template>

					<!-- site -->
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
							class="col-md-10"
							:options="sitesSelectItem"
							:multiple="true"
							@input="changeSiteIds"
						>
						</iv-form-selection>

						<div class="col-md-2">
							<b-button
								class="col-md-12"
								variant="outline-secondary"
								@click="pageToChooseTree"
							>
								{{ _('w_SelectSiteTree') }}
							</b-button>
						</div>

					</template>

					<!-- area -->
					<template #ifAllAreas="{ $attrs, $listeners }">

						<p class="ml-3" v-if="inputFormData.siteIds.length === 1">{{ _('w_Areas') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-if="inputFormData.siteIds.length === 1"
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
							v-if="inputFormData.siteIds.length === 1"
							v-on="$listeners"
							v-model="inputFormData.areaIds"
							class="col-md-12"
							:options="areaSelectItem"
							:multiple="true"
							@input="changeAreaIds"
						>
						</iv-form-selection>

					</template>

					<!-- group -->
					<template #ifAllGroups="{ $attrs, $listeners }">

						<p class="ml-3" v-if="inputFormData.siteIds.length === 1">{{ _('w_DeviceGroups') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-if="inputFormData.siteIds.length === 1"
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
							v-if="inputFormData.siteIds.length === 1"
							v-on="$listeners"
							v-model="inputFormData.groupIds"
							class="col-md-12"
							:options="deviceGroupSelectItem"
							:multiple="true"
							@input="changeGroupIds"
						>
						</iv-form-selection>

					</template>

					<!-- device -->
					<template #ifAllDevice="{ $attrs, $listeners }">

						<p class="ml-3" v-if="inputFormData.siteIds.length === 1">{{ _('w_Devices') }}</p>

						<b-col cols="9">
							<b-form-radio-group
								v-if="inputFormData.siteIds.length === 1"
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
							v-if="inputFormData.siteIds.length === 1"
							v-on="$listeners"
							v-model="inputFormData.deviceIds"
							class="col-md-12"
							:options="deviceSelectItem"
							:multiple="true"
							@input="changeDeviceIds"
						>
						</iv-form-selection>

					</template>

				</iv-form>

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
	import { Component, Prop, Vue, Watch } from "vue-property-decorator";

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

		transition: ITransition = {
			type: Transition.type,
			prevStep: 1,
			step: 1
		};

		// select 相關
		// radio button
		ifAllSitesSelectItem: any = [];
		ifAllAreasSelectItem: any = [];
		ifAllGroupsSelectItem: any = [];
		ifAllDeviceSelectItem: any = [];
		isAnyTimeSelectItem: any = [];

		// active 相關
		isActiveSelectItem: any = {};

		// store 相關
		sitesSelectItem: any = [];
		areaSelectItem: any = [];
		deviceGroupSelectItem: any = [];
		deviceSelectItem: any = [];


		// run time 相關
		runTimeRange = {
			hours: [],
			minutes: []
		};

		// radio button v-modal 相關
		selectAllSites: string = EIfAllSelected.select;
		isAnyTime: string = ERunTimeType.anyTime;
		isAllArea: string = EIfAllSelected.select;
		isAllGroup: string = EIfAllSelected.select;
		isAllDevice: string = EIfAllSelected.select;

		// tree
		selectType = ERegionType.site;
		regionTreeItem = new RegionTreeItem();
		selecteds: IRegionTreeSelected[] = [];


		anyTime = 'Any Time';

		inputFormData: any = {
			name: '',
			firstSiteId: '',
			isActive: '',
			time: undefined,

			siteIds: [],
			areaIds: [],
			groupIds: [],
			deviceIds: [],

			// 全選 site 相關
			allSiteIds: [],
			allAreaIds: [],
			allGroupIds: [],
			allDeviceIds: [],

			// run time 相關
			startHours: '10',
			startMinutes: '0',
			endHours: '20',
			endMinutes: '0',
		};


		created() {
			// no api
			this.initSelectItem();
			this.initRegionTreeSelect();
			this.initDayRanges();

			// api
			this.initSelectItemSite();
			this.initSelectItemTree();

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

			this.anyTime = this._('w_RuleAndActions_anyTime');
		}

		initDayRanges() {
			for (let i = 0; i < 24; i++) {
				const tempHour =
					i === 24 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
				const tempValue =
					tempHour + ":00" + (i < 12 || i > 23 ? " am" : " pm");
				const tempObject = { id: i.toString(), text: tempValue };
				this.runTimeRange.hours.push(tempObject);
			}

			for (let i = 0; i < 60; i++) {
				const tempMinute =
					i === 60 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
				const tempObject = { id: i.toString(), text: tempMinute };
				this.runTimeRange.minutes.push(tempObject);
			}


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
			}

			await this.$server
				.R("/location/area/all", readParam)
				.then((response: any) => {
					ResponseFilter.successCheck(this, response, (response: any) => {
						for (const returnValue of response) {
							let area = { id: returnValue.objectId, text: returnValue.name };
							this.areaSelectItem.push(area);
						}
					});
				})
				.catch((e: any) => {
					return ResponseFilter.catchError(this, e);
				});

			for (const detail of this.areaSelectItem) {
				this.inputFormData.allAreaIds.push(detail.id);
			}
		}

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
			}

			if (this.inputFormData.areaId) {
				readParam.areaId =
					this.inputFormData.areaId !== "all"
						? this.inputFormData.areaId
						: "";
			}

			await this.$server
				.R("/device/group/all", readParam)
				.then((response: any) => {
					ResponseFilter.successCheck(this, response, (response: any) => {
						for (const returnValue of response) {
							let group = { id: returnValue.objectId, text: returnValue.name };
							this.deviceGroupSelectItem.push(group);
						}
					});
				})
				.catch((e: any) => {
					return ResponseFilter.catchError(this, e);
				});

			for (const detail of this.deviceGroupSelectItem) {
				this.inputFormData.allGroupIds.push(detail.id);
			}
		}

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
			}

			if (this.inputFormData.areaId) {
				readParam.areaId =
					this.inputFormData.areaId !== "all"
						? this.inputFormData.areaId
						: "";
			}

			if (this.inputFormData.groupId) {
				readParam.groupId =
					this.inputFormData.groupId !== "all"
						? this.inputFormData.groupId
						: "";
			}

			await this.$server
				.R("/device", readParam)
				.then((response: any) => {
					ResponseFilter.successCheck(this, response, (response: any) => {
						if (
							response.results != undefined &&
							response.results.length > 0
						) {
							for (const returnValue of response.results) {
								let device = { id: returnValue.objectId, text: returnValue.name };
								this.deviceSelectItem.push(device);
							}
						}
					});
				})
				.catch((e: any) => {
					return ResponseFilter.catchError(this, e);
				});

			for (const detail of this.deviceSelectItem) {
				this.inputFormData.allDeviceIds.push(detail.id);
			}
		}

		////////////////////  以下為 radio button 相關   ////////////////////
		changeTimeSelect(selected: string) {
			this.isAnyTime = selected;
			if (this.isAnyTime === ERunTimeType.anyTime) {
				this.inputFormData.time = undefined;
			} else {
				const startDate = new Date(
					2000,
					1,
					1,
					parseInt(this.inputFormData.startHours.toString(), 10),
					parseInt(this.inputFormData.startMinutes.toString(), 10)
				);
				const endDate = new Date(
					2000,
					1,
					1,
					parseInt(this.inputFormData.endHours, 10),
					parseInt(this.inputFormData.endMinutes, 10)
				);

				this.inputFormData.time = {
					startDate, endDate
				}
			}

			this.$emit('time', this.inputFormData.time);
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

			this.$emit('site-ids', this.inputFormData.siteIds);
		}

		changeAllAreasSelect(selected: string) {

			this.isAllArea = selected;
			this.inputFormData.areaIds = [];

			if (this.isAllArea === EIfAllSelected.all) {
				this.inputFormData.areaIds = [];

				this.inputFormData.areaIds = this.inputFormData.allAreaIds;
			} else {
				this.inputFormData.areaIds = [];
			}

			this.$emit('area-ids', this.inputFormData.areaIds);
		}

		changeAllGroupsSelect(selected: string) {

			this.isAllGroup = selected;
			this.inputFormData.groupIds = [];

			if (this.isAllGroup === EIfAllSelected.all) {
				this.inputFormData.groupIds = [];

				this.inputFormData.groupIds = this.inputFormData.allGroupIds;
			} else {
				this.inputFormData.groupIds = [];
			}

			this.$emit('device-group-ids', this.inputFormData.groupIds);
		}

		changeAllDevicesSelect(selected: string) {

			this.isAllDevice = selected;
			this.inputFormData.deviceIds = [];

			if (this.isAllDevice === EIfAllSelected.all) {
				this.inputFormData.deviceIds = [];

				this.inputFormData.deviceIds = this.inputFormData.allDeviceIds;
			} else {
				this.inputFormData.deviceIds = [];
			}

			this.$emit('device-ids', this.inputFormData.deviceIds);

		}

		////////////////////  以上為 radio button 相關   ////////////////////

		updateName(name: string) {
			this.inputFormData.name = name;
			this.$emit('name', this.inputFormData.name);
		}

		updateActive(isActive: string) {
			this.inputFormData.isActive = isActive;
			this.$emit('active', this.inputFormData.isActive);
		}

		updateTime(data) {

			switch (data.key) {
				case 'startHours':
					this.inputFormData.startHours = data.value;
					break;
				case 'startMinutes':
					this.inputFormData.startMinutes = data.value;
					break;
				case 'endHours':
					this.inputFormData.endHours = data.value;
					break;
				case 'endMinutes':
					this.inputFormData.endMinutes = data.value;
					break;
			}

			const startDate = new Date(
				2000,
				1,
				1,
				parseInt(this.inputFormData.startHours.toString(), 10),
				parseInt(this.inputFormData.startMinutes.toString(), 10)
			);
			const endDate = new Date(
				2000,
				1,
				1,
				parseInt(this.inputFormData.endHours, 10),
				parseInt(this.inputFormData.endMinutes, 10)
			);

			this.inputFormData.time = {
				startDate, endDate
			};

			this.$emit('time', this.inputFormData.time);
		}

		async changeSiteIds() {
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

			if (this.inputFormData.siteIds.length === 1) {
				await this.initSelectItemArea();
				await this.initSelectItemDeviceGroup();
				await this.initSelectItemDevice();

				this.isAllArea = EIfAllSelected.select;
				this.isAllGroup = EIfAllSelected.select;
				this.isAllDevice = EIfAllSelected.select;

				this.inputFormData.areaIds = [];
				this.inputFormData.groupIds = [];
				this.inputFormData.deviceIds = [];
			}

			this.$emit('site-ids', this.inputFormData.siteIds);
		}

		changeAreaIds() {
			if (
				this.inputFormData.areaIds.length !==
				this.inputFormData.allAreaIds.length
			) {
				this.isAllArea = EIfAllSelected.select;
			} else if (
				this.inputFormData.areaIds.length ===
				this.inputFormData.allAreaIds.length
			) {
				this.isAllArea = EIfAllSelected.all;
			}

			this.$emit('area-ids', this.inputFormData.areaIds);

		}

		changeGroupIds() {
			if (
				this.inputFormData.groupIds.length !==
				this.inputFormData.allGroupIds.length
			) {
				this.isAllGroup = EIfAllSelected.select;
			} else if (
				this.inputFormData.groupIds.length ===
				this.inputFormData.allGroupIds.length
			) {
				this.isAllGroup = EIfAllSelected.all;
			}

			this.$emit('device-group-ids', this.inputFormData.groupIds);

		}

		changeDeviceIds() {
			if (
				this.inputFormData.deviceIds.length !==
				this.inputFormData.allDeviceIds.length
			) {
				this.isAllDevice = EIfAllSelected.select;
			} else if (
				this.inputFormData.deviceIds.length ===
				this.inputFormData.allDeviceIds.length
			) {
				this.isAllDevice = EIfAllSelected.all;
			}

			this.$emit('device-ids', this.inputFormData.deviceIds);

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
                isActive: ${toEnumInterface(
                    this.isActiveSelectItem as any,
                    false
                )};


                /**
                 * @uiColumnGroup - isAnytime
                 */
                isAnytime?: any;


                anyTime?: string;


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

.time {
    width: 21%;
}
</style>
