<template>
    <div key="main">
        <p>
            <iv-language-button />
        </p>

        <iv-table
            :server="{ path: '/test/me' }"
            interface='
            interface {
                /**
                 * @uiType - iv-cell-auto-index
                 */
                autoIndex: any;
                objectId: string;
                teststr: string;
                testnumber: string;
                /**
                 * @uiType - iv-form-switch
                 */
                testboolean: boolean;

                /**
                 * @uiType - iv-cell-date
                 * @uiAttrs - { format: "YYYY/MM/DD HH:mm:ss dddd ddd MMMM MMM A a" }
                 */
                createdAt: Date;
                updatedAt: Date;
            }
            '
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Table extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
