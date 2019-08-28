<template>
    <div key="main">

        <!-- <iv-auto-transition :step="step">
            <iv-auto-card v-if="step===1">
                <iv-table />
            </iv-auto-card>

            <ivc-custom-form />
        </iv-auto-transition> -->

        <iv-auto-card
            :label="_('wb_Search')"
            >
            <iv-form
                :interface="personSearchForm()"
                @submit="doSearch"
                />
        </iv-auto-card>
        <ivc-person-list-form />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Components extends Vue {
    private async logout() {
        await this.$logout();
        this.$goHome();
    }
    private personSearchForm() {
        return `
            interface {
                /*
                 * @uiLabel - ID
                 * @uiType - iv-form-string
                 */
                pid?: string;
                /*
                 * @uiLabel - ${this._('w_Name')}
                 * @uiType - iv-form-string
                 */
                name_zh?: string;
            }
        `
    }
    private doSearch(val) {
        console.log(val);
    }
}
</script>
<style lang="scss" scope>
.user-photo {
    height: 50px;
    img {
        height: 100%;
    }
}
</style>