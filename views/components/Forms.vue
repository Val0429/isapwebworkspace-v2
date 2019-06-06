<template>
    <div>
        <p>
            <iv-language-button />
        </p>

        <iv-form
            ref="form"
            @mounted="doMounted"
            :interface="inf()"
        >
            <template #object="{$attrs, $listeners}">
                <iv-form-server-object
                    v-bind="$attrs"
                    v-on="$listeners"
                    :server="{ path: '/announcements' }"
                />
            </template>
        </iv-form>

        <template v-if="isMounted">
            <b-button
                size="lg"
                v-bind="$refs.form.submitBindings.$attrs"
                v-on="$refs.form.submitBindings.$listeners"
            >{{ _("wb_Submit") }}</b-button>
            <b-button
                size="lg"
                v-bind="$refs.form.resetBindings.$attrs"
                v-on="$refs.form.resetBindings.$listeners"
            >{{ _("wb_Reset") }}</b-button>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Forms extends Vue {
    private inf() {
        return `
        interface {
            account: string;
            /**
             * @uiType - iv-form-password
             */
            password: string;
            /**
             * @uiType - iv-form-password
             * @uiValidation - (value, all) => value === all.password
             * @uiInvalidMessage - Password should be the same.
             */
            confirmpassword: string;
            /**
             * @uiType - iv-form-ip
             */
            ip: string;
            port: number;
            /**
             * @uiType - iv-form-license
             */
            license: string;
            /**
             * @uiColumnGroup - date
             */
            starttime: Date;
            /**
             * @uiColumnGroup - date
             */
            endtime: Date;
            enable: boolean;
            object: any;
            selection: ${toEnumInterface(
                {
                    "0": "Admin",
                    "1": "User"
                },
                false
            )};
            multiple: ${toEnumInterface(
                {
                    "0": "VIP",
                    "1": "Guard",
                    "2": "Blacklist",
                    "3": "Visitor"
                },
                true
            )};
        }
        `;
    }

    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
