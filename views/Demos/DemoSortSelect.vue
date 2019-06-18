<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col cols="6">
                <iv-card label="Select1">
                    <iv-sort-select
                        v-model="singleSelected"
                        :options="singleSelectItem"
                    ></iv-sort-select>
                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="demoBack"
                        >{{ _('w_Back') }}
                        </b-button>
                        <b-button
                            variant="primary"
                            size="lg"
                            @click="demoSubmit"
                        >{{ _('w_Submit') }}
                        </b-button>
                        <b-button
                            variant="default"
                            size="lg"
                            @click="demoReset"
                        >{{ _('w_Reset') }}
                        </b-button>
                    </template>
                </iv-card>
            </b-col>
            <b-col>
                <iv-card label="Select2">
                    <iv-sort-select-tree
                        v-model="singleSelected"
                        :options="singleSelectItem"
                    ></iv-sort-select-tree>
                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="demoBack"
                        >{{ _('w_Back') }}
                        </b-button>
                        <b-button
                            variant="primary"
                            size="lg"
                            @click="demoSubmit"
                        >{{ _('w_Submit') }}
                        </b-button>
                        <b-button
                            variant="default"
                            size="lg"
                            @click="demoReset"
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
import Dialog from "@/services/Dialog/Dialog";
import {
    ISortSelectOption,
    ISortSelectTreeOption
} from "@/components/SortSelect";
import SortSelect from "@/components/SortSelect/SortSelect.vue";
import SortSelectTree from "@/components/SortSelect/SortSelectTree.vue";

@Component({
    components: {
        SortSelect
    }
})
export default class DemoSortSelect extends Vue {
    singleSelected: string[] = ["A1", "A7", "B10"];
    singleSelectItem: ISortSelectOption[] = [
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

    created() {}
    mounted() {}

    demoBack() {
        Dialog.success("Click Back");
    }

    demoSubmit() {
        let submitText = "";
        for (let chooseSelected of this.singleSelected) {
            for (let chooseItem of this.singleSelectItem) {
                if (chooseSelected == chooseItem.value) {
                    submitText += `${chooseItem.text}<br>`;
                }
            }
        }
        Dialog.success(submitText);
    }

    demoReset() {
        Dialog.success("Click Reset");
    }
}
</script>

<style lang="scss" scoped>
</style>
