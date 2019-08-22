<template>
    <div>
        <iv-auto-card
            :visible="visible"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                @update:*="tempSaveInputData($event)"
                @submit="doSubmit($event)"
            >



            </iv-form>

            <template #footer>
                <b-button
                    class="submit"
                    size="lg"
                    @click="doSubmit"
                >
                    {{ _('wb_Submit') }}
                </b-button>

                <b-button
                    class="reset"
                    size="lg"
                    @click="doReset"
                >
                    {{ _('wb_Reset') }}
                </b-button>
            </template>

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import ResponseFilter from '@/services/ResponseFilter';

@Component({
    components: {}
})
export class ToolRepeatVisitorFilter extends Vue {

    siteSelectItem: any = {};

    // 收合card控制
    visible: boolean = true;

    created() {
        this.initSelectItemSite();
    }

    mounted() {
    }

    async initSelectItemSite() {

        this.siteSelectItem = {};
        let tempSiteSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempSiteSelectItem[returnValue.objectId] = returnValue.name;
                    }
                    this.siteSelectItem = tempSiteSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

}

export default ToolRepeatVisitorFilter;
Vue.component("tool-repeat-visitor-filter", ToolRepeatVisitorFilter);
</script>

<style lang="scss" scoped>
</style>
