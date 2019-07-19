<template>
    <div>
        <iv-form
            :interface="IAnalysisFilterForm()"
            @update:areaId="whenSelectedAreaId($event)"
            @update:groupId="whenSelectedGroupId($event)"
            @update:deviceId="whenSelectedDeviceId($event)"
            @update:type="whenSelectedType($event)"
            @update:isIncludedEmployee="whenSelectedIsIncludedEmployee($event)"
        >

            <template #areaId="{ $attrs, $listeners }">
                <iv-form-selection
                    class="col-md-2"
                    v-if="siteIds && siteIds.length === 1"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.areaId"
                >
                </iv-form-selection>
            </template>

        </iv-form>

    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";
import { toEnumInterface } from "../../../../core";
let config = require("@/config/default/debug");


@Component({
    components: {}
})
export class AnalysisFilterDemo extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    areaSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    deviceGroupSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    deviceSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default:{}
    })
    timeModeSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default:{}
    })
    isIncludedEmployeeSelectItem: object;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    siteIds: object;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    areaId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    groupId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    deviceId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "hour"
    })
    type: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "no"
    })
    isIncludedEmployee: string;

    inputFormData: any = {
        areaId: "all",
        groupId: "all",
        deviceId: "all",
        type: "day",
        inOrOut: "in",
        isIncludedEmployee: 'no'
    };

    created() {}

    mounted() {}

    @Watch("areaId", { deep: true })
    private areaIdChanged(newVal, oldVal) {
        this.inputFormData.areaId = newVal;
    }

    @Watch("groupId", { deep: true })
    private groupIdChanged(newVal, oldVal) {
        this.inputFormData.groupId = newVal;
    }

    @Watch("deviceId", { deep: true })
    private deviceIdChanged(newVal, oldVal) {
        this.inputFormData.deviceId = newVal;
    }

    @Watch("type", { deep: true })
    private typeChanged(newVal, oldVal) {
        this.inputFormData.type = newVal;
    }

    @Watch("isIncludedEmployee", { deep: true })
    private isIncludedEmployeeChanged(newVal, oldVal) {
        this.inputFormData.is = newVal;
    }

    async whenSelectedAreaId() {
        this.$emit("area_id", this.inputFormData.areaId);
    }

    async whenSelectedGroupId() {
        this.$emit("group_id", this.inputFormData.groupId);
    }

    async whenSelectedDeviceId() {
        this.$emit("device_id", this.inputFormData.deviceId);
    }

    whenSelectedType() {
        this.$emit("type", this.inputFormData.type);
    }

    whenSelectedIsIncludedEmployee() {
        this.$emit("is_included_employee", this.inputFormData.isIncludedEmployee);
    }

    IAnalysisFilterForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - analysis
                 */
                areaId?: ${toEnumInterface(this.areaSelectItem as any, false)};

            }
        `;
    }
}

export default AnalysisFilterDemo;
Vue.component("analysis-filter-demo", AnalysisFilterDemo);
</script>

<style lang="scss" scoped>
.click_button {
    margin-top: 27px;
}
</style>
