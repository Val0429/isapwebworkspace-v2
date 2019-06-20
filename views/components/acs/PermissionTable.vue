<template>
    <div key="main">

        <!--Main  List-->
        <div v-show="pageStep === ePageStep.list">
            <iv-auto-card :label="_('w_Search')">
                <iv-form
                    :interface="ISerachFrom()"
                    @submit="searchTable($event)"
                >
                </iv-form>
            </iv-auto-card>

            <iv-card :label="_('w_Permission_PermissionList')">
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />

                </template>

                <iv-table
                    ref="mainTable"
                    :interface="IMainTable()"
                    :multiple="tableMultiple"
                    :server="{ path: '/acs/member' }"
                    @selected="selectedItem($event)"
                >
                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more
                            size="sm"
                            :disabled="isSelected.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>
        </div>

        <!--Site Form (Add and Edit and View)-->
        <div v-if="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view">
            <iv-auto-card :label="pageStep == ePageStep.add ? _('w_Permission_PermissionAdd') : pageStep == ePageStep.edit ? _('w_Permission_PermissionEdit') :  _('w_Permission_PermissionView')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IForm()"
                    @update:*="updateForm($event)"
                    @submit="doSave($event)"
                >
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- Sub  Table -->
            <iv-card :label="_('w_Permission_PermissionList')">

                <iv-table
                    ref="subTable"
                    :interface="ISubTable()"
                    :multiple="tableMultiple"
                    :data="{data}"
                    @selected="selectedSubItem($event)"
                >
                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-delete @click="doDelete" />
                    </template>

                </iv-table>
            </iv-card>
        </div>

    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import PermissionTableForm from "./PermissionTableForm.vue";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

@Component({
    components: { PermissionTableForm }
})
export default class PermissionTable extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    tableMultiple = true;
    isSelected: any = [];
    selectedDetail: any = [];
    SearchParams: any = {};

    //options
    deviceNameItem: any = [];
    deviceAreaItem: any = [];
    deviceTimeFromatItem: any = [];

    created() {}

    mounted() {
        this.pageToList();
    }

    searchTable(data) {
        this.SearchParams = {
            name: data.permissionName
        };
        (this.$refs.mainTable as any).reload();
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.mainTable as any).reload();
    }

    pageToAdd() {
        this.pageStep = EPageStep.add;
    }

    pageToEdit() {
        this.pageStep = EPageStep.edit;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
    }

    doDelete() {}

    doSave() {}

    ISerachFrom() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                permissionName?: string;
              

            }
        `;
    }

    IMainTable() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                permissionName?: string;
              
                Actions: any;
            }
        `;
    }

    IForm() {
        return `
            interface {
  
                 /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                 permissionName: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceType")}
                 */
                 deviceType: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceName")}
                 */
                 deviceName?: ${toEnumInterface(
                     this.deviceNameItem as any,
                     false
                 )};

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceArea")}
                 */
                 deviceArea?: ${toEnumInterface(
                     this.deviceAreaItem as any,
                     false
                 )};

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 */
                 deviceTimeFormat?: ${toEnumInterface(
                     this.deviceTimeFromatItem as any,
                     false
                 )};

            }
        `;
    }

    ISubTable() {
        return `
            interface {
  
          

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 */
                 deviceType: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 */
                 deviceName: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 */
                 deviceArea: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 */
                 deviceTimeFormat: string;

                 Actions: any;
            }
        `;
    }
}
</script>
