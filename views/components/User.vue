<template>
    <div key="main">
        <iv-auto-transition
            :step="step"
            :type="type"
        >
            <template v-if="step === 1">

                <iv-auto-card
                    key="SearchCard"
                    :label="_('wb_Search')"
                >
                    <iv-form
                        :interface="personSearchForm()"
                        :value="defaultValue"
                        @submit="doSearch"
                    />
                </iv-auto-card>
            </template>
            <ivc-users-list-form
                key="UserForm"
                :params="personFilter"
            />
        </iv-auto-transition>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Components extends Vue {
    private step: number = 1;
    private type: string = "iv-direction-slide";
    private defaultValue = {
        username: "",
        sorting: {}
    };
    private personFilter: any = {};
    private personSearchForm() {
        return `
            interface {
                /*
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-string
                 */
                username?: string;
                
                sorting?: interface {
                    /*
                    * @uiLabel - ${this._("w_Sorting") +
                        this._("w_User") +
                        this._("w_Title")}
                    * @uiColumnGroup - sorting-group
                    */
                    username?: ${toEnumInterface({
                        asc: `${this._("w_Sorting_Asc")}`,
                        desc: `${this._("w_Sorting_Desc")}`
                    })}

                    /*
                    * @uiLabel - ${this._("w_Sorting") +
                        this._("w_User") +
                        this._("w_Group")}
                    * @uiColumnGroup - sorting-group
                    */
                    groups?: ${toEnumInterface({
                        asc: `${this._("w_Sorting_Asc")}`,
                        desc: `${this._("w_Sorting_Desc")}`
                    })}
                };
            }
        `;
    }
    private async doSearch(val) {
        if (val.sorting) {
            return (this.personFilter = {
                sorting: [
                    `${Object.keys(val.sorting)},${Object.values(val.sorting)}`
                ]
            });
        } else {
            return (this.personFilter = val);
        }
    }
}
</script>