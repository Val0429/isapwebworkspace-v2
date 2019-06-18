<template>
    <div class="sort-select">
        <div class="select-option-frame">
            <div>{{ _('w_Options') }}</div>
            <div class="sort-select-frame">
                <b-input
                    v-model="optionSearchText"
                    type="text"
                />
                <div class="button-frame">
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableSelectAllOption()"
                        @click="selectAllOption"
                    >
                        {{ _('w_AllChoose')}}
                    </b-button>
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableSelectResetOption()"
                        @click="clearOptions"
                    >
                        {{ _('w_Reset')}}
                    </b-button>
                </div>
                <hr>
                <div class="check-frame">
                    <iv-tree-form 
                        v-for="(option, index) of options"
                        :key="'sort__select__tree__root' + option.value + '__' + index"
                        :data="option" 
                        :optionSearchText="optionSearchText"
                    />
                </div>
            </div>
        </div>
        <div class="move-button-row">
            <b-row class="move-button-row">
                <b-col
                    cols="12"
                    class="move-button-frame"
                >
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableChooseToOption()"
                        @click="chooseToOption"
                    >
                        <i class="fa fa-arrow-left" />
                    </b-button>
                </b-col>
                <b-col
                    cols="12"
                    class="move-button-frame"
                >
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableOptionToChoose()"
                        @click="optionToChoose"
                    >
                        <i class="fa fa-arrow-right" />
                    </b-button>
                </b-col>
            </b-row>
        </div>
        <div class="select-option-frame">
            <div>{{ _('w_Chooses') }}</div>
            <div class="sort-select-frame">
                <b-input
                    v-model="chooseSearchText"
                    type="text"
                />
                <div class="button-frame">
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableSelectAllChoose()"
                        @click="selectAllChoose"
                    >
                        {{ _('w_AllChoose')}}
                    </b-button>
                    <b-button
                        class="button"
                        variant="default"
                        :disabled="disableSelectResetChoose()"
                        @click="clearAllChoose"
                    >
                        {{ _('w_Reset')}}
                    </b-button>
                    <div class="float-right">
                        <b-button
                            class="button button-sort"
                            variant="default"
                            :disabled="disableChooseSortUp()"
                            @click="chooseSortUp"
                        >
                            <i class="fa fa-caret-up" />
                        </b-button>
                        <b-button
                            class="button button-sort"
                            variant="default"
                            :disabled="disableChooseSortDown()"
                            @click="chooseSortDown"
                        >
                            <i class="fa fa-caret-down" />
                        </b-button>
                    </div>
                </div>
                <hr>
                <div class="check-frame">
                    <iv-tree-form 
                        v-for="(option, index) of this.chooseSelectItem"
                        :key="'sort__select__tree__choose' + option.value + '__' + index"
                        :data="option" 
                        :optionSearchText="optionSearchText"
                    />
                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { ISortSelectOption, ISortSelectTreeOption } from "./models/ISortSelect";
import { TreeView } from "./TreeView.vue";

interface IMergeTree {
    parent: boolean;
    children: boolean;
}

@Component({
    components: {
        TreeView
    }
})
export class SortSelectTree extends Vue {
    optionSearchText = "";
    chooseSearchText = "";

    optionsSelected: string[][] = [];
    chooseSelected: string[][] = [];
    optionsSelectItem: ISortSelectTreeOption[] = [];
    chooseSelectItem: ISortSelectTreeOption[] = [];

    // Model
    @Model("input", {
        type: Array,
        default: function() {
            return [];
        }
    })
    value: string[];

    // prop
    @Prop({
        type: Array,
        default: []
    })
    options: ISortSelectTreeOption[];

    created() {}

    mounted() {
        this.initValue();
    }

    initValue() {
        this.optionsSelected = [];
        this.chooseSelected = [];
        this.optionsSelectItem = [];
        this.chooseSelectItem = [];
        let anysisResult: ISortSelectTreeOption[] = [];

        for (let option of this.options) {
            let inValue = false;
            for (let val of this.value) {
                let tempOption = this.anysisChildren(val, option);
                if (tempOption != null) {
                    let tempMerge: IMergeTree = {parent: false, children: false};
                    for (let chooseItem of this.chooseSelectItem) {
                        tempMerge = this.mergeValue(
                            chooseItem,
                            tempOption as ISortSelectTreeOption
                        );
                        if (tempMerge.children) {
                            break;
                        }
                    }
                    if (!tempMerge.children) {
                        this.chooseSelectItem.push(tempOption);
                    }
                }
            }
        }
    }

    mergeValue(
        chooseItem: ISortSelectTreeOption,
        anysisResult: ISortSelectTreeOption
    ): IMergeTree {
        let result: IMergeTree = {children: false, parent: false};
        if (chooseItem.value == anysisResult.value) {
            result.children = true;
            if (anysisResult.childrens.length > 0) {
                let tempResult: IMergeTree = {children: false, parent: false};
                for (let chooseChildrens of chooseItem.childrens) {
                    tempResult = this.mergeValue(chooseChildrens, anysisResult.childrens[0]);
                    if (tempResult.parent && !tempResult.children) {
                        chooseItem.childrens.push(anysisResult.childrens[0]);
                        break;
                    }
                }
            } 
        } else {
            result.parent = true;
        }
        return result;
    }

    anysisChildren(
        value: string,
        option: ISortSelectTreeOption
    ): ISortSelectTreeOption | null {
        let result: any = null;
        let tempOption = JSON.parse(JSON.stringify(option));
        if (value == tempOption.value) {
            result = tempOption;
        } else {
            tempOption.childrens = [];
            for (let optionChildren of option.childrens) {
                let childrenResult = this.anysisChildren(value, optionChildren);
                if (childrenResult != null) {
                    result = tempOption;
                    result.childrens.push(childrenResult);
                }
            }
        }
        return result;
    }



    mergeChildren() {}

    // disable
    disableSelectAllOption(): boolean {
        let result = false;
        if (this.optionsSelected.length == this.optionsSelectItem.length) {
            result = true;
        }
        return result;
    }

    disableSelectResetOption(): boolean {
        let result = false;
        if (this.optionsSelected.length == 0) {
            result = true;
        }
        return result;
    }

    disableSelectAllChoose(): boolean {
        let result = false;
        if (this.chooseSelected.length == this.chooseSelectItem.length) {
            result = true;
        }
        return result;
    }

    disableSelectResetChoose(): boolean {
        let result = false;
        if (this.chooseSelected.length == 0) {
            result = true;
        }
        return result;
    }

    disableChooseSortUp(): boolean {
        let result = false;
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined && this.chooseSelected.length == 1) {
            // for (let i in this.chooseSelectItem) {
            //     let choose = this.chooseSelectItem[i];
            //     if (chooseSelected == choose.value) {
            //         if (parseInt(i) == 0) {
            //             result = true;
            //         }
            //         break;
            //     }
            // }
        } else {
            result = true;
        }
        return result;
    }

    disableChooseSortDown() {
        let result = false;
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined && this.chooseSelected.length == 1) {
            // for (let i in this.chooseSelectItem) {
            //     let choose = this.chooseSelectItem[i];
            //     if (chooseSelected == choose.value) {
            //         if (parseInt(i) == this.chooseSelectItem.length - 1) {
            //             result = true;
            //         }
            //         break;
            //     }
            // }
        } else {
            result = true;
        }
        return result;
    }

    disableChooseToOption(): boolean {
        return this.chooseSelected.length < 1;
    }

    disableOptionToChoose(): boolean {
        return this.optionsSelected.length < 1;
    }

    // option
    selectAllOption() {
        this.optionsSelected = [];
        // for (let option of this.optionsSelectItem) {
        //     this.optionsSelected.push(option.value);
        // }
    }

    clearOptions() {
        this.optionsSelected = [];
    }

    // choose
    showChoose(data: string): boolean {
        let result = true;
        if (this.chooseSearchText != "" && !data.match(this.chooseSearchText)) {
            result = false;
        }
        return result;
    }

    selectAllChoose() {
        this.chooseSelected = [];
        // for (let choose of this.chooseSelectItem) {
        //     this.chooseSelected.push(choose.value);
        // }
    }

    clearAllChoose() {
        this.chooseSelected = [];
    }

    chooseSortUp() {
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined) {
            let chooseIndex = -1;
            let tempChooseItem: any = undefined;
            // for (let i in this.chooseSelectItem) {
            //     let chooseItem = this.chooseSelectItem[i];
            //     if (chooseItem.value == chooseSelected) {
            //         chooseIndex = parseInt(i);
            //         tempChooseItem = JSON.parse(JSON.stringify(chooseItem));
            //         this.chooseSelectItem.splice(parseInt(i), 1);
            //         break;
            //     }
            // }
            if (chooseIndex > 0) {
                this.chooseSelectItem.splice(
                    chooseIndex - 1,
                    0,
                    tempChooseItem
                );
            }
        }
        this.$emit("input", this.resultList());
    }

    chooseSortDown() {
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined) {
            let chooseIndex = -1;
            let tempChooseItem: any = undefined;
            // for (let i in this.chooseSelectItem) {
            //     let chooseItem = this.chooseSelectItem[i];
            //     if (chooseItem.value == chooseSelected) {
            //         chooseIndex = parseInt(i);
            //         tempChooseItem = JSON.parse(JSON.stringify(chooseItem));
            //         this.chooseSelectItem.splice(parseInt(i), 1);
            //         break;
            //     }
            // }
            if (chooseIndex < this.chooseSelectItem.length) {
                this.chooseSelectItem.splice(
                    chooseIndex + 1,
                    0,
                    tempChooseItem
                );
            }
        }
        this.$emit("input", this.resultList());
    }

    // change option and choose
    chooseToOption() {
        // for (let choose of this.chooseSelected) {
        //     for (let i in this.chooseSelectItem) {
        //         let chooseItem = this.chooseSelectItem[i];
        //         if (choose == chooseItem.value) {
        //             this.optionsSelectItem.push(
        //                 JSON.parse(JSON.stringify(chooseItem))
        //             );
        //             this.chooseSelectItem.splice(parseInt(i), 1);
        //             break;
        //         }
        //     }
        // }
        this.chooseSelected = [];
        this.$emit("input", this.resultList());
    }

    optionToChoose() {
        // for (let option of this.optionsSelected) {
        //     for (let i in this.optionsSelectItem) {
        //         let optionItem = this.optionsSelectItem[i];
        //         if (option == optionItem.value) {
        //             this.chooseSelectItem.push(
        //                 JSON.parse(JSON.stringify(optionItem))
        //             );
        //             this.optionsSelectItem.splice(parseInt(i), 1);
        //             break;
        //         }
        //     }
        // }
        this.optionsSelected = [];
        this.$emit("input", this.resultList());
    }

    resultList(): string[] {
        let result: string[] = [];
        for (let choose of this.chooseSelectItem) {
            result.push(choose.value);
        }
        return result;
    }
}

Vue.component("iv-sort-select-tree", SortSelectTree);
export default SortSelectTree;
</script>

<style lang="scss" scoped>
.sort-select {
    display: flex;
    .move-button-row {
        width: 67px;
        padding-top: 100px;
        .move-button-frame {
            text-align: center;
            i {
                font-size: 3rem;
            }
        }
    }
    .select-option-frame {
        flex: 0.5;
        .sort-select-frame {
            border: 1px solid $gray-300;
            padding: 5px;
            .button-frame {
                margin-top: 5px;
                .button {
                    margin-right: 5px;
                    &.button-sort {
                        font-size: 1.2rem;
                    }
                }
            }
            .check-frame {
                height: 400px;
                overflow-x: hidden;
                overflow-y: auto;
                padding: 10px;
                .checkbox-group {
                    margin-bottom: 5px;
                }
            }
            hr {
                margin-top: 3px;
                margin-bottom: 3px;
            }
        }
    }
}
</style>