<template>
    <div>
    <p><iv-language-button /></p>

    <ivc-announcements />

    <!-- <ivc-test /> -->

    <b-button @click="logout">Logout</b-button>

    <b-button @click="hidden = true">Test</b-button>

    <iv-auto-card label="123">
        <iv-form
            ref="form"
            :interface="inf()"
            @submit="log"
        >
        </iv-form>
    </iv-auto-card>

    <!-- <template v-if="isMounted">
        <b-button size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners">{{ _("wb_Submit") }}</b-button>
        <b-button size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners">{{ _("wb_Reset") }}</b-button>
    </template> -->


    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import DatePicker from 'vue2-datepicker';

@Component({
    components: { DatePicker }
})
export default class Form2 extends Vue {
    private isMounted: boolean = false;
    mounted() {
        this.isMounted = true;
    }

    hidden: boolean = false;
    private inf() {
        return `
        interface {
            /**
             * @uiLabel - Header is here
             * @uiType - iv-form-header
             */
            header?: any;

            /**
             * @uiType - iv-form-textarea
             */
            account: string;

            location: interface {
                x: number;
                y: number;
            };

            selection: ${toEnumInterface({
                '0': '123',
                '1': '456',
                '2': '789'
            }, false)};
        }
        `;
    }

    private log() {
        console.log(...arguments);
    }

    private async logout() {
        await this.$logout();
        console.log('push go');
        this.$router.push('//');
    }
}
</script>
