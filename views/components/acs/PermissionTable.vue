<template>
    <div key="main">

        <iv-auto-card :label="_('w_Search')">
            <iv-form
                :interface="ISerachFrom()"
                @submit="searchTable($event)"
            >
            </iv-form>
        </iv-auto-card>

        <iv-card :label="_('w_Permission_PermissionList')">
            <template #toolbox>
                <iv-toolbox-search @keyup="cardSearch"></iv-toolbox-search>

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
                :server="{ path: '/users' }"
                @selected="selectedItem($event)"
            >
                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more
                        size="sm"
                        :disabled="isSelected.length !== 1"
                    >
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit()" />
                        <iv-toolbox-delete @click="delteMainTable" />
                    </iv-toolbox-more>
                </template>

            </iv-table>
        </iv-card>

    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import PermissionTableForm from "./PermissionTableForm.vue";

@Component({
    components: { PermissionTableForm }
})
export default class PermissionTable extends Vue {
    isSelected: any = [];
    selectedDetail: any = [];
    SearchParams: any = {};

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
}
</script>
