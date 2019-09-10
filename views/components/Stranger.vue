<template>
    <div key="main">
        <iv-auto-card
            key="SearchCard"
            :label="_('wb_Search')"
        >
            <iv-form
                :interface="strangerSearchForm()"
                :value="defaultValue"
                @submit="doSearch"
            />
        </iv-auto-card>
        <iv-auto-card
            key="ListTable"
            :label="_('m_Persons_Person_List')"
        >
            <iv-table
                ref="table"
                :server="{ 'path': '/continental/unrecognizeduser' }"
                :params="strangerFilter"
                :interface="strangeList()"
                :selectable="false"
            >
                <template #snapshot="{$attrs}">
                    <img
                        :src="getSnapshotUrl($attrs.value)"
                        style="max-width:50px; max-height: 50px;"
                    />
                </template>
            </iv-table>
        </iv-auto-card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Components extends Vue {
    private defaultValue = {
        siteid: "",
        workarea: ""
    };
    private strangerFilter: any = {
        sorting: "updatedAt,desc"
    };
    private strangerSearchForm() {
        return `
            interface {
                /*
                 * @uiLabel - ${this._("w_Site")}
                 * @uiType - iv-form-string
                 */
                siteid?: string;
                /*
                 * @uiLabel - ${this._("w_Work_Area")}
                 * @uiType - iv-form-string
                 */
                workarea?: string;
            }
        `;
    }
    private strangeList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Picture")}
                 */
                snapshot: string;
                /**
                 * @uiLabel - ${this._("w_Timestamp")}
                 */
                updatedAt: Date;
                /**
                 * @uiLabel - ${this._("w_Site")}
                 */
                siteid: string;
                /**
                 * @uiLabel - ${this._("w_Work_Area")}
                 */
                workarea: string;
                /**
                 * @uiLabel - ${this._("w_Camera_Position")}
                 */
                channel: string;
            }
        `;
    }
    private async doSearch(val) {
        this.strangerFilter = {
            ...this.strangerFilter,
            ...val
        };
    }
    private getSnapshotUrl(snapshot: string) {
        let ref = this.$server
            .Url("/persons/snapshotimage" as any, {})
            .replace(/\?$/, "");
        return `${ref}/image=${snapshot}`;
    }
}
</script>
