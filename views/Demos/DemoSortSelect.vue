<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col cols="6">
                <iv-card label="Select1">
                    <iv-sort-select
                        v-model="singleSelected"
                        :options="singleSelectOption"
                    ></iv-sort-select>
                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="demoBackSingle"
                        >{{ _('w_Back') }}
                        </b-button>
                        <b-button
                            variant="primary"
                            size="lg"
                            @click="demoSubmitSingle"
                        >{{ _('w_Submit') }}
                        </b-button>
                        <b-button
                            variant="default"
                            size="lg"
                            @click="demoResetSingle"
                        >{{ _('w_Reset') }}
                        </b-button>
                    </template>
                </iv-card>
            </b-col>
            <b-col>
                <iv-card label="Select2">
                    <iv-sort-select-tree
                        v-model="treeSelected"
                        :options="treeSelectOption"
                    ></iv-sort-select-tree>
                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="demoBackTree"
                        >{{ _('w_Back') }}
                        </b-button>
                        <b-button
                            variant="primary"
                            size="lg"
                            @click="demoSubmitTree"
                        >{{ _('w_Submit') }}
                        </b-button>
                        <b-button
                            variant="default"
                            size="lg"
                            @click="demoResetTree"
                        >{{ _('w_Reset') }}
                        </b-button>
                    </template>
                </iv-card>
            </b-col>
        </b-row>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import {
    ISortSelectOption,
    ISortSelectTreeOption
} from "@/components/SortSelect";
import SortSelect from "@/components/SortSelect/SortSelect.vue";
import SortSelectTree from "@/components/SortSelect/SortSelectTree.vue";

@Component({
    components: {
        SortSelect,
        SortSelectTree
    }
})
export default class DemoSortSelect extends Vue {
    singleSelected: string[] = ["A1", "A7", "B10"];
    singleSelectOption: ISortSelectOption[] = [
        { value: "A1", text: "A 1" },
        { value: "A2", text: "A 2" },
        { value: "A3", text: "A 3" },
        { value: "A4", text: "A 4" },
        { value: "A5", text: "A 5" },
        { value: "A6", text: "A 6" },
        { value: "A7", text: "A 7" },
        { value: "A8", text: "A 8" },
        { value: "A9", text: "A 9" },
        { value: "A10", text: "A 10" },
        { value: "B1", text: "B 1" },
        { value: "B2", text: "B 2" },
        { value: "B3", text: "B 3" },
        { value: "B4", text: "B 4" },
        { value: "B5", text: "B 5" },
        { value: "B6", text: "B 6" },
        { value: "B7", text: "B 7" },
        { value: "B8", text: "B 8" },
        { value: "B9", text: "B 9" },
        { value: "B10", text: "B 10" }
    ];

    treeSelected: string[] = ["A12", "A11", "A132", "A1331", "A1335", "A3"];
    treeSelectOption: ISortSelectTreeOption[] = [
        {
            value: "A1",
            text: "A1",
            childrens: [
                {
                    value: "A11",
                    text: "A11",
                    childrens: [{ value: "A111", text: "A111", childrens: [] }]
                },
                { value: "A12", text: "A12", childrens: [] },
                {
                    value: "A13",
                    text: "A13",
                    childrens: [
                        { value: "A131", text: "A131", childrens: [] },
                        { value: "A132", text: "A132", childrens: [] },
                        {
                            value: "A133",
                            text: "A133",
                            childrens: [
                                {
                                    value: "A1331",
                                    text: "A1331",
                                    childrens: []
                                },
                                {
                                    value: "A1332",
                                    text: "A1332",
                                    childrens: []
                                },
                                {
                                    value: "A1333",
                                    text: "A1333",
                                    childrens: []
                                },
                                {
                                    value: "A1334",
                                    text: "A1334",
                                    childrens: []
                                },
                                {
                                    value: "A1335",
                                    text: "A1335",
                                    childrens: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            value: "A2",
            text: "A2",
            childrens: [
                {
                    value: "A21",
                    text: "A21",
                    childrens: [{ value: "A211", text: "A211", childrens: [] }]
                },
                { value: "A22", text: "A22", childrens: [] }
            ]
        },
        {
            value: "A3",
            text: "A3",
            childrens: [{ value: "A31", text: "A31", childrens: [] }]
        }
    ];

    created() {}
    mounted() {}

    demoBackSingle() {
        Dialog.success("Click Back from Single Layer");
    }

    demoSubmitSingle() {
        let submitText = "";
        for (let chooseSelected of this.singleSelected) {
            for (let chooseItem of this.singleSelectOption) {
                if (chooseSelected == chooseItem.value) {
                    submitText += `${chooseItem.text}<br>`;
                }
            }
        }
        Dialog.success(submitText);
    }

    demoResetSingle() {
        Dialog.success("Click Reset");
    }

    demoBackTree() {
        Dialog.success("Click Back from Tree");
    }

    demoSubmitTree() {
        let submitText = "";
        for (let chooseSelected of this.treeSelected) {
            submitText += `${chooseSelected}<br>`;
        }
        Dialog.success(submitText);
    }

    demoResetTree() {
        Dialog.success("Click Reset");
    }
}
</script>

<style lang="scss" scoped>
</style>
