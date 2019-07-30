<template>
    <iv-form :interface="IFilterConditionForm()">

	    <template #notifyMethodTitle="{ $attrs, $listeners }">
		    <p class="ml-3 mr-3 ">{{ _('w_RuleAndActions_NotifyMethod') }}</p>
	    </template>

	    <template #notifyMethodSelect="{ $attrs, $listeners }">
		    <b-form-checkbox
			    v-for="option in notifyMethodSelectItem"
			    v-model="notifyMethodSelected"
			    name="notifyMethodSelect"
			    class="col-md-10"
			    :key="option.value"
			    :value="option.value"
			    inline
		    >
			    {{ option.text }}
		    </b-form-checkbox>
	    </template>


	    <template #notifyTargetTitle="{ $attrs, $listeners }">
		    <p class="ml-3 mr-3 ">{{ _('w_RuleAndActions_NotifyTarget') }}</p>
	    </template>

	    <template #notifyTargetSelect="{ $attrs, $listeners }">
		    <b-form-checkbox
			    v-for="option in notifyTargetSelectItem"
			    v-model="notifyTargetSelected"
			    name="notifyMethodSelect"
			    class=""
			    :key="option.value"
			    :value="option.value"
			    inline
		    >
			    {{ option.text }}
		    </b-form-checkbox>
	    </template>

	    <template #userIds="{ $attrs, $listeners }">
		    <iv-form-selection
			    v-if="notifyTargetSelected.filter(item => item === 'users').join() === 'users'"
			    v-bind="$attrs"
			    v-on="$listeners"
			    v-model="inputFormData.userIds"
		    >
		    </iv-form-selection>
	    </template>

	    <template #groupIds="{ $attrs, $listeners }">
		    <iv-form-selection
			    v-if="notifyTargetSelected.filter(item => item === 'userGroup').join() === 'userGroup'"
			    v-bind="$attrs"
			    v-on="$listeners"
			    v-model="inputFormData.groupIds"
		    >
		    </iv-form-selection>
	    </template>


	    <template #notifyFrequently>

	    </template>

	    <template #notifyFrequentlyRemarks>

	    </template>

    </iv-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { ENotifyMethod, EWhoNotify } from "@/components/RuleAndActions";

// Service
import { toEnumInterface } from "../../../core";
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
    // checkbox
	notifyMethodSelectItem: any = [];
	notifyTargetSelectItem: any = [];

	// user, userGroup
	userSelectItem: any = {};
	userGroupSelectItem: any = {};

	// be selected
	notifyMethodSelected: any = [ENotifyMethod.email];
	notifyTargetSelected: any = [EWhoNotify.storeManager, EWhoNotify.permissionOfStore, EWhoNotify.users, EWhoNotify.userGroup];

    inputFormData: any = {
	    userIds: '',
	    groupIds: "",
    };

    created() {
        // no api
        this.initSelectItem();

        // api
	    this.initSelectItemUsers();
	    this.initSelectItemUserGroup();

    }

    mounted() {}

    initSelectItem() {
        this.notifyMethodSelectItem = [
        	// { value: ENotifyMethod.mobileApp, text: this._("w_RuleAndActions_MobileApp") },
        	// { value: ENotifyMethod.sms, text: this._("w_RuleAndActions_SMS") },
        	{ value: ENotifyMethod.email, text: this._("w_RuleAndActions_Email") },
        	// { value: ENotifyMethod.httpCommand, text: this._("w_RuleAndActions_HttpCommand") }
        ];

	    this.notifyTargetSelectItem = [
		    { value: EWhoNotify.storeManager, text: this._("w_RuleAndActions_StoreManager") },
		    { value: EWhoNotify.permissionOfStore, text: this._("w_RuleAndActions_UsersHavePermission") },
		    { value: EWhoNotify.users, text: this._("w_RuleAndActions_Users") },
		    { value: EWhoNotify.userGroup, text: this._("w_RuleAndActions_UserGroup") },
	    ];
    }

	async initSelectItemUsers() {
		let tempUserSelectItem = {};
		this.userSelectItem = {};

		await this.$server
			.R("/user/user")
			.then((response: any) => {
				if (response != undefined) {
					for (const returnValue of response.results) {
						// 自定義 userSelectItem 的 key 的方式
						tempUserSelectItem[returnValue.objectId] = returnValue.username;
					}
					this.userSelectItem = tempUserSelectItem;
				}
			})
			.catch((e: any) => {
				return ResponseFilter.catchError(this, e);
			});
	}

	async initSelectItemUserGroup() {

		let tempUserGroupSelectItem = {};
		this.userGroupSelectItem = {};

		await this.$server
			.R("/user/group/all")
			.then((response: any) => {
				ResponseFilter.successCheck(this, response, (response: any) => {
					for (const returnValue of response) {
						tempUserGroupSelectItem[returnValue.objectId] = returnValue.name;
					}
					this.userGroupSelectItem = tempUserGroupSelectItem;

				});
			})
			.catch((e: any) => {
				return ResponseFilter.catchError(this, e);
			});
	}

    IFilterConditionForm() {
	    return `
            interface {

                notifyMethodTitle: any;

                notifyMethodSelect: any;

                notifyTargetTitle: any;

                notifyTargetSelect: any;


				/**
                 * @uiLabel - ${this._("w_RuleAndActions_Users")}
                 */
                userIds?: ${toEnumInterface(this.userSelectItem as any, true)};


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_UserGroup")}
                 */
                groupIds?: ${toEnumInterface(
				    this.userGroupSelectItem as any,
				    true
			    )};


                notifyFrequently: any;

                notifyFrequentlyRemarks: any;




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
