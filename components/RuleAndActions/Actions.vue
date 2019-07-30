<template>
	<iv-form
		:interface="IFilterConditionForm()"
	>

	</iv-form>

</template>

<script lang="ts">
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
                isActive: any;


                /**
                 * @uiColumnGroup - isAnytime
                 */
                isAnytime?: any;


                anyTime?: string;


            }
        `;
		}
	}

	export default Actions;
	Vue.component("actions", Actions);
</script>

<style lang="scss" scoped>

</style>
