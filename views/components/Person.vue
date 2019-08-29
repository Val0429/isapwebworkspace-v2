<template>
    <div key="main">
        <iv-auto-transition :step="step" :type="type">
            <template
                v-if="step === 1"
                >
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
                <iv-auto-card
                    key="ListTable"
                    :label="_('m_Persons_Person_List')">
                    <iv-table
                        ref="table"
                        :server="{ 'path': '/continental/workcards' }"
                        :params="personFilter"
                        :interface="personList()"
                        >
                        <template #photo_base64="{ $attrs, $listeners }">
                            <div class="user-photo">
                                <img :src="'data:image/jpg;base64,' + $attrs.value" alt="">
                            </div>
                        </template>
                        <template #actions="{ $attrs, $listeners }">
                            <ivc-toolbox-actions
                                @click="readMore"
                                />
                        </template>
                    </iv-table>
                </iv-auto-card>
            </template>
            <template v-else-if="step === 2">
                <ivc-person-list-detail
                    key="personListDetail"
                    />
            </template>
        </iv-auto-transition>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Components extends Vue {
    private defaultValue = {
        pid: '',
        name_zh: ''
    };
    private step: number = 1;
    private type: string = "iv-direction-slide";
    private personListData: any = {};
    private personData: any;
    private personFilter: any = {};
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
    private personList() {
        return `
            interface {
                /*
                 * @uiLabel - ID
                 */
                pid: string;
                /*
                 * @uiLabel - ${this._('w_Type')}
                 */
                workcard_type: string;
                /*
                 * @uiLabel - ${this._('w_Title')}
                 */
                name_zh: string;
                /*
                 * @uiLabel - ${this._('w_Picture')}
                 */
                photo_base64?: any;
                /*
                 * @uiLabel - ${this._('w_Actions')}
                 */
                actions?: any;
            }
        `
    }
    private async doSearch(val) {
        this.personFilter = val;
        console.log(this.defaultValue)
    }
    private readMore() {
        this.step = 2;
    }
    private async mounted() {
        let data:any = {} = await this.$server.R('/continental/workcards');
        this.personListData = data.results;
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