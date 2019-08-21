<template>
    <div>
        <iv-form
            :interface="IFilterConditionForm()"
        >
            <template #type="{ $attrs, $listeners }">
                <iv-form-selection
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="mode.type"
                    @input="updateMode($event)"
                >
                </iv-form-selection>
            </template>
        </iv-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
    import { toEnumInterface } from "../../../core";
    import Datetime from '@/services/Datetime';

    enum EMode {
        peopleCounting = 'peopleCounting',
        dwellTime = 'dwellTime',
        visitor = 'visitor',
        vip = 'vip',
        black = 'black',
    }

    @Component({
        components: {}
    })
    export class SelectDeviceType extends Vue {
        // Prop
        @Prop({
            type: Object, // Boolean, Number, String, Array, Object
            default: () => {}
        })
        modeParam: any;

        metricSelectItem: any = {};

        mode: any = {
            type: EMode.peopleCounting,
            modeTitle: '',
        };

        created() {
            this.initSelectItem();
        }

        mounted() {
        }

        initSelectItem() {
            this.metricSelectItem = {
                peopleCounting: this._("w_Navigation_VideoSources_PeopleCounting"),
                dwellTime: this._("w_Navigation_VideoSources_DwellTime"),
                visitor: this._("w_ReportDashboard_RepeatCustomer1"),
                vip: this._("w_VIPAndBlackList_TableTitleVip"),
                black: this._("w_VIPAndBlackList_TableTitleBlacklist")
            };

            this.mode.modeTitle = this.modeParam.modeTitle;
            this.mode.type = this.modeParam.type;
        }

        updateMode(data) {

            switch (data) {
                case EMode.peopleCounting:
                    this.mode.modeTitle = this._('w_Navigation_RuleAndActions_Traffic');
                    this.mode.type = EMode.peopleCounting;
                    break;
                case EMode.dwellTime:
                    this.mode.modeTitle = this._('w_Navigation_VideoSources_DwellTime');
                    this.mode.type = EMode.dwellTime;
                    break;
                case EMode.visitor:
                    this.mode.modeTitle = this._('w_ReportDashboard_RepeatCustomer1');
                    this.mode.type = EMode.visitor;
                    break;
                case EMode.vip:
                    this.mode.modeTitle = this._('w_VIPAndBlackList_TableTitleVip');
                    this.mode.type = EMode.vip;
                    break;
                case EMode.black:
                    this.mode.modeTitle = this._('w_VIPAndBlackList_TableTitleBlacklist');
                    this.mode.type = EMode.black;
                    break;

            }
            this.$emit('mode', this.mode)
        }

        IFilterConditionForm() {
            return `
            interface {


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                type: ${toEnumInterface(this.metricSelectItem as any, false)};

            }
        `;
        }
    }

    export default SelectDeviceType;
    Vue.component("select-device-type", SelectDeviceType);
</script>

<style lang="scss" scoped>
</style>
