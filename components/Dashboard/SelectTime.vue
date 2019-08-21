<template>
    <div>
        <iv-form
            :interface="IFilterConditionForm()"
        >
            <template #time="{ $attrs, $listeners }">
                <iv-form-selection
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="time"
                    @input="updateTime($event)"
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

    @Component({
        components: {}
    })
    export class SelectTime extends Vue {
        // Prop
        @Prop({
            type: String, // Boolean, Number, String, Array, Object
            default: ""
        })
        label: string;

        timeSelectItem: any = {};

        time: string = '';

        created() {
            this.initSelectItem();
        }

        mounted() {
        }

        initSelectItem() {
            this.timeSelectItem = {
                today: `${this._("w_Dashboard_Today")} ( ${Datetime.CountDateNumber(0)} ~ ${Datetime.CountDateNumber(0)} )`,
                yesterday: `${this._("w_Dashboard_Yesterday")} ( ${Datetime.CountDateNumber(-1)} ~ ${Datetime.CountDateNumber(-1)} )`,
                last7day: `${this._("w_Dashboard_Last7Day")} ( ${Datetime.CountDateNumber(-6)} ~ ${Datetime.CountDateNumber(0)} )`,
                last14day: `${this._("w_Dashboard_Last14Day")} ( ${Datetime.CountDateNumber(-13)} ~ ${Datetime.CountDateNumber(0)} )`,
                last28day: `${this._("w_Dashboard_Last28Day")} ( ${Datetime.CountDateNumber(-27)} ~ ${Datetime.CountDateNumber(0)} )`,
                last30day: `${this._("w_Dashboard_Last30Day")} ( ${Datetime.CountDateNumber(-29)} ~ ${Datetime.CountDateNumber(0)} )`,
                last60day: `${this._("w_Dashboard_Last60Day")} ( ${Datetime.CountDateNumber(-59)} ~ ${Datetime.CountDateNumber(0)} )`,
                last90day: `${this._("w_Dashboard_Last90Day")} ( ${Datetime.CountDateNumber(-89)} ~ ${Datetime.CountDateNumber(0)} )`,
                last180day: `${this._("w_Dashboard_Last180Day")} ( ${Datetime.CountDateNumber(-179)} ~ ${Datetime.CountDateNumber(0)} )`,
                thisYear: `${this._("w_thisYear")} ( ${Datetime.ThisYearStartDate()} ~ ${Datetime.ThisYearEndDate()} )`
            };
        }

        updateTime(data) {

            let submitParam : {
                startDate: Date;
                endDate: Date;
            } = {
                startDate: Datetime.DateToZero(new Date()),
                endDate: Datetime.DateToZero(new Date()),
            };

            switch (data) {
                case 'today':
                    submitParam.startDate = Datetime.DateToZero(new Date());
                    submitParam.endDate = Datetime.DateToZero(new Date());
                    break;
                case 'yesterday':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    break;
                case 'last7day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-6)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last14day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-13)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last28day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-27)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last30day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-29)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last60day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-59)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last90day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-89)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'last180day':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-179)));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    break;
                case 'thisYear':
                    submitParam.startDate = Datetime.DateToZero(new Date(Datetime.ThisYearStartDate()));
                    submitParam.endDate = Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()));
                    break;
            }
            this.$emit('time', submitParam)
        }

        IFilterConditionForm() {
            return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Dashboard_SelectTime")}
                 */
                time?: ${toEnumInterface(this.timeSelectItem as any, false)};

            }
        `;
        }
    }

    export default SelectTime;
    Vue.component("select-time", SelectTime);
</script>

<style lang="scss" scoped>
</style>
