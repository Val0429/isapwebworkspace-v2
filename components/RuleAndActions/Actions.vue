<template>
    <iv-form
        :interface="IFilterConditionForm()"
        @update:minutes="updateMinutes($event)"
    >

        <template #notifyMethodTitle>
            <p class="col-md-12 mb-2">{{ _('w_RuleAndActions_NotifyMethod') }}</p>
        </template>

        <template #notifyMethodSelect="{ $attrs, $listeners }">


            <b-form-checkbox
                :disabled="disabled"
                v-for="option in notifyMethodSelectItem"
                v-model="notifyMethodSelected"
                :key="option.value"
                :value="option.value"
                name="notifyMethodSelected"
                class="col-md-12 ml-4 mb-2"
                inline
                @input="changeNotifyMethod"
            >
                {{ option.text }}
            </b-form-checkbox>

            <!--            <b-form-checkbox-group-->
            <!--                v-model="notifyMethodSelected"-->
            <!--                id="notifyMethodSelected"-->
            <!--                name="notifyMethodSelected"-->
            <!--                class="col-md-12 mb-2"-->
            <!--                @input="changeNotifyMethod"-->
            <!--            >-->
            <!--                <b-form-checkbox-->
            <!--                    value="email"-->
            <!--                    class="col-md-12 ml-4"-->
            <!--                >-->
            <!--                    {{ _('w_RuleAndActions_Email') }}-->
            <!--                </b-form-checkbox>-->
            <!--                                <b-form-checkbox value="mobileApp">{{ _('w_RuleAndActions_MobileApp') }}</b-form-checkbox>-->
            <!--                                <b-form-checkbox value="sms">{{ _('w_RuleAndActions_SMS') }}</b-form-checkbox>-->
            <!--                                <b-form-checkbox value="httpCommand">{{ _('w_RuleAndActions_HttpCommand') }}</b-form-checkbox>-->

            <!--            </b-form-checkbox-group>-->

        </template>

        <template #notifyTargetTitle="{ $attrs, $listeners }">
            <p class="col-md-12 mt-3 mb-2">{{ _('w_RuleAndActions_NotifyTarget') }}</p>
        </template>

        <template #notifyTargetSelect>

            <b-form-checkbox
                :disabled="disabled"
                v-for="option in notifyTargetSelectItem"
                v-model="notifyTargetSelected"
                :key="option.value"
                :value="option.value"
                name="notifyTargetSelected"
                class="col-md-12 ml-4 mb-2"
                inline
                @input="changeNotifyTarget"
            >
                {{ option.text }}
            </b-form-checkbox>

            <!--            <b-form-checkbox-group-->
            <!--                v-model="notifyTargetSelected"-->
            <!--                id="notifyTargetSelected"-->
            <!--                name="notifyTargetSelected"-->
            <!--                class="col-md-12"-->
            <!--                @input="changeNotifyTarget"-->
            <!--            >-->
            <!--                <b-form-checkbox-->
            <!--                    value="storeManager"-->
            <!--                    class="col-md-12 ml-4 mb-2"-->
            <!--                >{{ _('w_RuleAndActions_StoreManager') }}</b-form-checkbox>-->
            <!--                <b-form-checkbox-->
            <!--                    value="permissionOfStore"-->
            <!--                    class="col-md-12 ml-4 mb-2"-->
            <!--                >{{ _('w_RuleAndActions_UsersHavePermission') }}</b-form-checkbox>-->
            <!--                <b-form-checkbox-->
            <!--                    value="users"-->
            <!--                    class="col-md-12 ml-4 mb-2"-->
            <!--                >{{ _('w_RuleAndActions_Users') }}</b-form-checkbox>-->
            <!--                <b-form-checkbox-->
            <!--                    value="userGroup"-->
            <!--                    class="col-md-12 ml-4 mb-4"-->
            <!--                >{{ _('w_RuleAndActions_UserGroup') }}</b-form-checkbox>-->
            <!--            </b-form-checkbox-group>-->

        </template>

        <template #userIdsTitle="{ $attrs, $listeners }">
            <p
                v-if="notifyTargetSelected.filter(item => item === 'users').join() === 'users'"
                class="col-md-12 mt-2"
            >{{ _('w_RuleAndActions_Users1') }}</p>
        </template>

        <template #userIds="{ $attrs, $listeners }">

            <iv-form-selection
                :disabled="disabled"
                v-if="notifyTargetSelected.filter(item => item === 'users').join() === 'users'"
                v-on="$listeners"
                v-model="inputFormData.userIds"
                class="col-md-12"
                :options="userSelectItem"
                :multiple="true"
                @input="selectUserIds"
            >
            </iv-form-selection>
        </template>

        <template #groupIdsTitle="{ $attrs, $listeners }">

            <p
                v-if="notifyTargetSelected.filter(item => item === 'userGroup').join() === 'userGroup'"
                class="col-md-12 mt-2"
            >{{ _('w_RuleAndActions_UserGroup1') }}</p>
        </template>

        <template #groupIds="{ $attrs, $listeners }">

            <iv-form-selection
                :disabled="disabled"
                v-if="notifyTargetSelected.filter(item => item === 'userGroup').join() === 'userGroup'"
                v-on="$listeners"
                v-model="inputFormData.groupIds"
                class="col-md-12"
                :options="userGroupSelectItem"
                :multiple="true"
                @input="selectUserGroupIds"
            >
            </iv-form-selection>
        </template>

        <template #minutes="{ $attrs, $listeners }">
            <iv-form-number
                :disabled="disabled"
                v-bind="$attrs"
                v-on="$listeners"
                v-model="inputFormData.minutes"
                class="mt-3"
            >
            </iv-form-number>
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

    @Prop({
        type: Boolean,
        default: false
    })
    disabled: boolean;

    // select 相關
    // checkbox
    notifyMethodSelectItem: any = [];
    notifyTargetSelectItem: any = [];

    // user, userGroup
    userSelectItem: any = [];
    userGroupSelectItem: any = [];

    // checkbox be selected
    notifyMethodSelected: any = [];
    notifyTargetSelected: any = [];

    inputFormData: any = {
        email: undefined,
        storeManager: undefined,
        permissionOfStore: undefined,

        userIds: [],
        groupIds: [],
        minutes: 0,
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
            // 註解掉的是未來會增加的
            // { value: ENotifyMethod.mobileApp, text: this._("w_RuleAndActions_MobileApp") },
            // { value: ENotifyMethod.sms, text: this._("w_RuleAndActions_SMS") },
            {
                value: ENotifyMethod.email,
                text: this._("w_RuleAndActions_Email")
            }
            // { value: ENotifyMethod.httpCommand, text: this._("w_RuleAndActions_HttpCommand") }
        ];

        this.notifyTargetSelectItem = [
            {
                value: EWhoNotify.storeManager,
                text: this._("w_RuleAndActions_StoreManager")
            },
            {
                value: EWhoNotify.permissionOfStore,
                text: this._("w_RuleAndActions_UsersHavePermission")
            },
            { value: EWhoNotify.users, text: this._("w_RuleAndActions_Users") },
            {
                value: EWhoNotify.userGroup,
                text: this._("w_RuleAndActions_UserGroup")
            }
        ];
    }

    async initSelectItemUsers() {
        this.userSelectItem = [];

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        let user = {
                            id: returnValue.objectId,
                            text: returnValue.username
                        };
                        this.userSelectItem.push(user);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemUserGroup() {
        this.userGroupSelectItem = [];

        await this.$server
            .R("/user/group/all")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        let userGroup = {
                            id: returnValue.objectId,
                            text: returnValue.name
                        };
                        this.userGroupSelectItem.push(userGroup);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    changeNotifyMethod() {

        if (this.notifyMethodSelected.filter(item => item === ENotifyMethod.email).join() === ENotifyMethod.email) {
            this.inputFormData.email = true;
        } else {
            this.inputFormData.email = false;

        }

        this.$emit("email", this.inputFormData.email);
    }

    changeNotifyTarget() {

        this.inputFormData.storeManager = this.notifyTargetSelected.filter(item => item === EWhoNotify.storeManager).join() === EWhoNotify.storeManager;

        this.inputFormData.permissionOfStore = this.notifyTargetSelected.filter(item => item === EWhoNotify.permissionOfStore).join() === EWhoNotify.permissionOfStore;

        if (
            this.notifyTargetSelected
                .filter(item => item === EWhoNotify.users)
                .join() !== EWhoNotify.users
        ) {
            this.inputFormData.userIds = [];
        } else if (
            this.notifyTargetSelected
                .filter(item => item === EWhoNotify.userGroup)
                .join() !== EWhoNotify.userGroup
        ) {
            this.inputFormData.groupIds = [];
        }

        this.$emit("store-manager", this.inputFormData.storeManager);
        this.$emit("permission-of-store", this.inputFormData.permissionOfStore);
    }

    selectUserIds(selected: object) {
        this.inputFormData.userIds = selected;
        this.$emit("user-ids", this.inputFormData.userIds);
    }

    selectUserGroupIds(selected: object) {
        this.inputFormData.groupIds = selected;
        this.$emit("user-group-ids", this.inputFormData.groupIds);
    }

    updateMinutes(minutes: number) {
        this.inputFormData.minutes = minutes;
        this.$emit("minutes", this.inputFormData.minutes);
    }

    IFilterConditionForm() {
        return `
            interface {

                notifyMethodTitle?: any;

                notifyMethodSelect?: any;

                notifyTargetTitle?: any;

                notifyTargetSelect?: any;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Users1")}
                 */
                userIdsTitle?: any;


                userIds?: ${toEnumInterface(this.userSelectItem as any, true)};


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_UserGroup1")}
                 */
                groupIdsTitle?: any;


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_UserGroup1")}
                 */
                groupIds?: ${toEnumInterface(
                    this.userGroupSelectItem as any,
                    true
                )};


                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Frequently") +
                     this._("w_RuleAndActions_Minute")}
                 * @uiAttrs - { min: 0}
                 */
                minutes: number;

            }
        `;
    }
}

export default Actions;
Vue.component("actions", Actions);
</script>
<style lang="scss" scoped>
.user {
    width: 97%;
    margin-left: 36px;
}
</style>
