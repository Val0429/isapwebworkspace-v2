<template>
    <div key="main">
        <iv-table
            ref="table"
            :server="{ 'path': '/continental/unrecognizeduser' }"
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
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Components extends Vue {
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
                workplace: string;
                /**
                 * @uiLabel - ${this._("w_Work_Area")}
                 */
                channel: string;
            }
        `;
    }
    private getSnapshotUrl(snapshot: string) {
        let ref = this.$server
            .Url("/persons/snapshotimage" as any, {})
            .replace(/\?$/, "");
        return `${ref}/image=${snapshot}`;
    }
}
</script>
