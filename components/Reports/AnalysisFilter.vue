<template>
    <div>

        <iv-form
            :interface="IAnalysisFilterForm()"
            @update:*="whenSelected($event)"
        >
            <template #areaIds="{ $attrs, $listeners }">
                <iv-form-selection
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.areaIds"
                >
                </iv-form-selection>
            </template>


            <template #selectInOrOut="{ $attrs, $listeners }">

                <b-form-radio-group
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.type"
                    class="h-25 select_date_button"
                    buttons
                    button-variant="outline-success"
                    name="radio-btn-outline"
                    :options="typeSelectItem"
                ></b-form-radio-group>
            </template>

        </iv-form>




        <b-button @click="test">test</b-button>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

enum EPageStep {
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

enum EType {
    in = "in",
    out = "out",
}

@Component({
    components: {}
})
export class AnalysisFilter extends Vue {
    // Prop
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: "000"
    // })
    // label: string;


    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ''
    })
    siteIds0: string;

    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: {}
    // })
    // regionTreeItem: object;

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    inputData = "Test input data";
    modelData = "";

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    typeSelectItem:  any = [
        { value: EType.in, text: EType.in },
        { value: EType.out, text: EType.out },
    ];

    inputFormData: any = {
        areaIds: null ,
        groupIds: null,
        deviceIds: null,
        type: 'in'
    };


    created() {
    }

    async mounted() {
        this.start();
        this.modelData = this.value;
    }

    start() {
        this.$emit("input", this.inputData);
    }

    putModel() {
        this.$emit("model", this.modelData);
    }

    async test() {
        // console.log('siteIds0 - ', this.siteIds0);
        await this.initSelectItemArea();

    }



    async initSelectItemArea() {
        if (this.siteIds0 !== undefined) {
            let tempAreaSelectItem = {};

            const readSingleAreaParam: {
                siteId: string;
            } = {
                siteId: this.siteIds0
            };

            await this.$server
                .R("/location/area/all", readSingleAreaParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 sitesSelectItem 的 key 的方式
                            tempAreaSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.areaSelectItem = tempAreaSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        } else {
            return false;
        }
        console.log('this.areaSelectItem - ', this.areaSelectItem);
    }

    // async initSelectItemDeviceGroup() {
    //     if (this.filterData.siteIds && this.filterData.siteIds.length === 1 && ) {
    //         let tempDeviceGroupSelectItem = {};
    //
    //         const readSingleAreaParam: {
    //             siteId: string;
    //         } = {
    //             siteId: this.filterData.siteIds[0]
    //         };
    //
    //         await this.$server
    //             .R("/location/area/all", readSingleAreaParam)
    //             .then((response: any) => {
    //                 if (response != undefined) {
    //                     for (const returnValue of response) {
    //                         // 自定義 sitesSelectItem 的 key 的方式
    //                         tempDeviceGroupSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //     } else {
    //         return false;
    //     }
    //
    // }

    whenSelected() {}

    doSubmit() {
        // TODO: wait api
        this.$emit("submit-data", this.inputFormData);
        this.inputFormData = {
            areaIds: []
        };
    }

    IAnalysisFilterForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - analysis
                 */
                areaIds?: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroups")}
                 * @uiColumnGroup - analysis
                 */
                groupIds?: ${toEnumInterface(this.deviceGroupSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Devices")}
                 * @uiColumnGroup - analysis
                 */
                deviceIds?: ${toEnumInterface(this.deviceSelectItem as any, false)};

                /**
                 * @uiColumnGroup - analysis
                 */
                selectInOrOut?: any;
            }
        `
    }
}

export default AnalysisFilter;
Vue.component("analysis_filter", AnalysisFilter);
</script>

<style lang="scss" scoped>
.select_report_period_button {
    margin-top: 27px;
}

.select_date_button {
    margin-top: 29px;
}
</style>
