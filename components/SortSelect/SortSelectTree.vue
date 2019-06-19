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
                        v-for="(sortSelectTreeItem, index) of sortSelectTreeItemList"
                        :key="'sort__select__tree__root' + sortSelectTreeItem.value + '__' + index"
                        :type="eSortSelectTreeEventType.option"
                        :data="sortSelectTreeItem"
                        :searchText="optionSearchText"
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
                        v-for="(sortSelectTreeItem, index) of this.sortSelectTreeItemList"
                        :key="'sort__select__tree__choose' + sortSelectTreeItem.value + '__' + index"
                        :type="eSortSelectTreeEventType.choose"
                        :data="sortSelectTreeItem"
                        :searchText="chooseSearchText"
                    />
                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { ESortSelectTreeEventType } from "./models/ESortSelectTree";
import { ISortSelectOption } from "./models/ISortSelect";
import {
    ISortSelectTreeOption,
    ISortSelectTreeItem
} from "./models/ISortSelectTree";
import { TreeView } from "./TreeView.vue";
import { zip } from "rxjs";

interface IMergeTree {
    parent: boolean;
    children: boolean;
}

interface ISortIndex {
    prev: number;
    now: number;
    next: number;
}

@Component({
    components: {
        TreeView
    }
})
export class SortSelectTree extends Vue {
    eSortSelectTreeEventType = ESortSelectTreeEventType;

    optionSearchText: string = "";
    chooseSearchText: string = "";
    checkboxClickTrues: string[] = [];
    selected: string[] = [];
    sortSelectTreeItemList: ISortSelectTreeItem[] = [];
    sortIndex: ISortIndex = {
        prev: -1,
        now: -1,
        next: -1
    };

    // Prop
    @Prop({
        type: Array,
        default: []
    })
    options: ISortSelectTreeOption[];

    // Model
    @Model("input", {
        type: Array,
        default: function() {
            return [];
        }
    })
    value: string[];

    created() {}

    mounted() {
        this.sortSelectTreeItemList = [];
        this.initSelected();
        this.anysisOption();
        this.calculateSelected();
        this.resetVModel();
    }

    defaultSortSelectTreeItem(): ISortSelectTreeItem {
        let result: ISortSelectTreeItem = {
            value: "",
            text: "",
            event: {
                clickCheckbox: false,
                clickCheckboxType: ESortSelectTreeEventType.none
            },
            status: {
                optionFocus: false,
                chooseFocus: false,
                choose: false,
                childrenChoose: false
            },
            childrens: []
        };
        return JSON.parse(JSON.stringify(result));
    }

    @Watch("sortSelectTreeItemList", { deep: true })
    private onChangedSortSelectTreeItemList(
        newval: ISortSelectTreeItem[],
        oldval: ISortSelectTreeItem[]
    ) {
        for (let sortSelectTreeItem of newval) {
            if (sortSelectTreeItem.event.clickCheckbox) {
                if (
                    sortSelectTreeItem.event.clickCheckboxType ==
                    ESortSelectTreeEventType.choose
                ) {
                    if (sortSelectTreeItem.status.chooseFocus) {
                        this.pushValueToTrueList(sortSelectTreeItem.value);
                    } else {
                        this.removeFromTrueList(sortSelectTreeItem.value);
                    }
                }
                for (let children of sortSelectTreeItem.childrens) {
                    this.onWatchFocusChildren(children, sortSelectTreeItem);
                }
                sortSelectTreeItem.event.clickCheckbox = false;
            }
            this.onWatchChildrenChange(sortSelectTreeItem);
            this.calculateChooseFocusSortIndex();
        }
    }

    onWatchChildrenChange(sortSelectTreeItem: ISortSelectTreeItem) {
        if (sortSelectTreeItem.event.clickCheckbox) {
            if (
                sortSelectTreeItem.event.clickCheckboxType ==
                ESortSelectTreeEventType.choose
            ) {
                if (sortSelectTreeItem.status.chooseFocus) {
                    this.pushValueToTrueList(sortSelectTreeItem.value);
                } else {
                    this.removeFromTrueList(sortSelectTreeItem.value);
                }
            }
            for (let children of sortSelectTreeItem.childrens) {
                this.onWatchFocusChildren(children, sortSelectTreeItem);
            }
            sortSelectTreeItem.event.clickCheckbox = false;
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.onWatchChildrenChange(children);
        }
        this.calculateChooseFocusSortIndex();
    }

    onWatchFocusChildren(
        sortSelectTreeItem: ISortSelectTreeItem,
        clickItem: ISortSelectTreeItem
    ) {
        switch (clickItem.event.clickCheckboxType) {
            case ESortSelectTreeEventType.option:
                sortSelectTreeItem.status.optionFocus =
                    clickItem.status.optionFocus;
                break;
            case ESortSelectTreeEventType.choose:
                sortSelectTreeItem.status.chooseFocus =
                    clickItem.status.chooseFocus;
                break;
            case ESortSelectTreeEventType.none:
            default:
                break;
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.onWatchFocusChildren(children, clickItem);
        }
    }

    pushValueToTrueList(value: string) {
        let inList = false;
        for (let checkboxClickTrue of this.checkboxClickTrues) {
            if (checkboxClickTrue == value) {
                inList = true;
                break;
            }
        }
        if (!inList) {
            this.checkboxClickTrues.push(value);
        }
    }

    removeFromTrueList(value: string) {
        for (let i in this.checkboxClickTrues) {
            let checkboxClickTrue = this.checkboxClickTrues[i];
            if (checkboxClickTrue == value) {
                this.checkboxClickTrues.splice(parseInt(i), 1);
            }
        }
    }

    calculateChooseFocusSortIndex() {
        this.sortIndex.prev = -1;
        this.sortIndex.now = -1;
        this.sortIndex.next = -1;
        if (this.checkboxClickTrues.length == 1) {
            let checkResult = this.calculateChooseFocusSortIndexChildren(
                this.sortSelectTreeItemList
            );
            if (checkResult > -1) {
                this.calculateRootSortIndex();
            }
        }
    }

    calculateChooseFocusSortIndexChildren(
        sortSelectTreeItemList: ISortSelectTreeItem[]
    ): number {
        if (this.checkboxClickTrues.length != 1) {
            return -1;
        }
        for (let i in sortSelectTreeItemList) {
            let sortSelectTreeItem = sortSelectTreeItemList[i];
            if (sortSelectTreeItem.value == this.checkboxClickTrues[0]) {
                this.sortIndex.now = parseInt(i);
                return this.sortIndex.now;
            }
            this.calculateChooseFocusSortIndexChildren(
                sortSelectTreeItem.childrens
            );
            if (this.sortIndex.now != -1) {
                this.calculateChildrenSortIndex(sortSelectTreeItem);
                break;
            }
        }
        return -1;
    }

    calculateRootSortIndex() {
        for (let i in this.sortSelectTreeItemList) {
            let children = this.sortSelectTreeItemList[i];
            let iNumber = parseInt(i);
            if (iNumber < this.sortIndex.now) {
                if (children.status.choose) {
                    this.sortIndex.prev = iNumber;
                }
            } else if (iNumber > this.sortIndex.now) {
                if (children.status.choose) {
                    this.sortIndex.next = iNumber;
                    break;
                }
            } else {
                continue;
            }
        }
    }

    calculateChildrenSortIndex(sortSelectTreeItem: ISortSelectTreeItem) {
        for (let i in sortSelectTreeItem.childrens) {
            let children = sortSelectTreeItem.childrens[i];
            let iNumber = parseInt(i);
            if (iNumber < this.sortIndex.now) {
                if (children.status.choose) {
                    this.sortIndex.prev = iNumber;
                }
            } else if (iNumber > this.sortIndex.now) {
                if (children.status.choose) {
                    this.sortIndex.next = iNumber;
                    break;
                }
            } else {
                continue;
            }
        }
    }

    initSelected() {
        this.selected = [];
        for (let val of this.value) {
            this.pushSelected(val);
        }
    }

    // 分析物件從 prop
    anysisOption() {
        for (let option of this.options) {
            this.sortSelectTreeItemList.push(
                this.anysisOptionChildren(option, false)
            );
        }
    }

    // 分析下層物件從 prop
    anysisOptionChildren(
        sortSelectTreeOption: ISortSelectTreeOption,
        parentChoose: boolean
    ): ISortSelectTreeItem {
        let result: ISortSelectTreeItem = this.defaultSortSelectTreeItem();
        result.value = sortSelectTreeOption.value;
        result.text = sortSelectTreeOption.text;

        // 上層被選就全選
        if (parentChoose) {
            result.status.choose = true;
        } else {
            for (let val of this.selected) {
                if (val == result.value) {
                    result.status.choose = true;
                    break;
                }
            }
        }

        // 判斷下層結果
        for (let children of sortSelectTreeOption.childrens) {
            result.childrens.push(
                this.anysisOptionChildren(children, result.status.choose)
            );
        }

        // 判斷是否有下層被選
        let childrenChooseCount = this.calculateChildrenChooseCount(
            result.childrens
        );
        if (
            childrenChooseCount > 0 &&
            childrenChooseCount == result.childrens.length
        ) {
            result.status.choose = true;
        } else if (
            childrenChooseCount > 0 &&
            childrenChooseCount < result.childrens.length
        ) {
            result.status.childrenChoose = true;
        }
        return result;
    }

    // 計算下層數量
    calculateChildrenChooseCount(
        sortSelectTreeItemList: ISortSelectTreeItem[]
    ): number {
        let result = 0;
        for (let sortSelectTreeItem of sortSelectTreeItemList) {
            if (sortSelectTreeItem.status.choose) {
                result++;
            }
        }
        return result;
    }

    // 計算被選取物件
    calculateSelected() {
        this.selected = [];
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            if (sortSelectTreeItem.status.choose) {
                this.pushSelected(sortSelectTreeItem.value);
            }
            this.calculateChoose(
                sortSelectTreeItem,
                sortSelectTreeItem.status.choose
            );
        }
    }

    // 判斷選取
    calculateChoose(
        sortSelectTreeItem: ISortSelectTreeItem,
        parentChoose: boolean
    ) {
        if (parentChoose) {
            this.pushSelected(sortSelectTreeItem.value);
        } else {
            if (sortSelectTreeItem.status.choose) {
                this.pushSelected(sortSelectTreeItem.value);
            }
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.calculateChoose(children, sortSelectTreeItem.status.choose);
        }
    }

    // 重設 selected
    pushSelected(value: string) {
        let inSelected = false;
        for (let sel of this.selected) {
            if (value == sel) {
                inSelected = true;
                break;
            }
        }
        if (!inSelected) {
            this.selected.push(value);
        }
        this.resetVModel();
    }

    // 計算全部元件數量
    calculAllItemTotal(): number {
        let result = 0;
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            result += this.claculChildrenItemTotal(sortSelectTreeItem);
        }
        return result;
    }

    claculChildrenItemTotal(sortSelectTreeItem: ISortSelectTreeItem): number {
        let result = 0;
        result++;
        for (let children of sortSelectTreeItem.childrens) {
            result += this.claculChildrenItemTotal(children);
        }
        return result;
    }

    // 計算全部 choose 數量
    calculOptionAllItemTotal(): number {
        let result = 0;
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            result += this.calculOptionAllChildrenTotal(sortSelectTreeItem);
        }
        return result;
    }

    calculOptionAllChildrenTotal(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        if (!sortSelectTreeItem.status.choose) {
            result++;
        }
        for (let children of sortSelectTreeItem.childrens) {
            result += this.calculOptionAllChildrenTotal(children);
        }
        return result;
    }

    calculOptionFocusItemTotal(): number {
        let result = 0;
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            result += this.calculOptionFocusChildrenTotal(sortSelectTreeItem);
        }
        return result;
    }

    calculOptionFocusChildrenTotal(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        if (
            !sortSelectTreeItem.status.choose &&
            sortSelectTreeItem.status.optionFocus
        ) {
            result++;
        }
        for (let children of sortSelectTreeItem.childrens) {
            result += this.calculOptionFocusChildrenTotal(children);
        }
        return result;
    }

    // 計算全部 choose 數量
    calculChooseAllItemTotal(): number {
        let result = 0;
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            result += this.calculChooseAllChildrenTotal(sortSelectTreeItem);
        }
        return result;
    }

    calculChooseAllChildrenTotal(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        if (sortSelectTreeItem.status.choose) {
            result++;
        }
        for (let children of sortSelectTreeItem.childrens) {
            result += this.calculChooseAllChildrenTotal(children);
        }
        return result;
    }

    // 計算 choose 被打勾數量
    calculChooseFocusItemTotal(): number {
        let result = 0;
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            result += this.calculChooseFocusChildrenTotal(sortSelectTreeItem);
        }
        return result;
    }

    calculChooseFocusChildrenTotal(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        if (
            sortSelectTreeItem.status.choose &&
            sortSelectTreeItem.status.chooseFocus
        ) {
            result++;
        }
        for (let children of sortSelectTreeItem.childrens) {
            result += this.calculChooseFocusChildrenTotal(children);
        }
        return result;
    }

    // disable
    disableSelectAllOption(): boolean {
        let result = false;
        let allTotal = this.calculOptionAllItemTotal();
        let focusTotal = this.calculOptionFocusItemTotal();
        if (focusTotal >= allTotal) {
            result = true;
        }
        return result;
    }

    disableSelectResetOption(): boolean {
        let result = false;
        let allTotal = this.calculOptionAllItemTotal();
        let focusTotal = this.calculOptionFocusItemTotal();
        if (focusTotal == 0) {
            result = true;
        }
        return result;
    }

    disableSelectAllChoose(): boolean {
        let result = false;
        let allTotal = this.calculChooseAllItemTotal();
        let focusTotal = this.calculChooseFocusItemTotal();
        if (focusTotal >= allTotal) {
            result = true;
        }
        return result;
    }

    disableSelectResetChoose(): boolean {
        let result = false;
        let allTotal = this.calculChooseAllItemTotal();
        let focusTotal = this.calculChooseFocusItemTotal();
        if (focusTotal == 0) {
            result = true;
        }
        return result;
    }

    disableChooseSortUp(): boolean {
        let result = false;
        if (this.checkboxClickTrues.length != 1 || this.sortIndex.prev == -1) {
            result = true;
        }
        return result;
    }

    disableChooseSortDown() {
        let result = false;
        if (this.checkboxClickTrues.length != 1 || this.sortIndex.next == -1) {
            result = true;
        }
        return result;
    }

    disableChooseToOption(): boolean {
        let result = false;
        let focusTotal = this.calculChooseFocusItemTotal();
        if (focusTotal <= 0) {
            result = true;
        }
        return result;
    }

    disableOptionToChoose(): boolean {
        let result = false;
        let focusTotal = this.calculOptionFocusItemTotal();
        if (focusTotal <= 0) {
            result = true;
        }
        return result;
    }

    // all or reset
    selectAllOption() {
        this.focusAllItem(ESortSelectTreeEventType.option, true);
    }

    clearOptions() {
        this.focusAllItem(ESortSelectTreeEventType.option, false);
    }

    selectAllChoose() {
        this.focusAllItem(ESortSelectTreeEventType.choose, true);
    }

    clearAllChoose() {
        this.focusAllItem(ESortSelectTreeEventType.choose, false);
    }

    focusAllItem(type: ESortSelectTreeEventType, focus: boolean) {
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            this.focusAllChildrenItem(sortSelectTreeItem, type, focus);
        }
    }

    focusAllChildrenItem(
        sortSelectTreeItem: ISortSelectTreeItem,
        type: ESortSelectTreeEventType,
        focus: boolean
    ) {
        switch (type) {
            case ESortSelectTreeEventType.option:
                sortSelectTreeItem.status.optionFocus = focus;
                break;
            case ESortSelectTreeEventType.choose:
                sortSelectTreeItem.status.chooseFocus = focus;
                break;
            case ESortSelectTreeEventType.none:
            default:
                break;
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.focusAllChildrenItem(children, type, focus);
        }
    }

    // change option and choose
    chooseToOption() {
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            this.chooseToOptionChildren(sortSelectTreeItem);
        }
        this.resetVModel();
    }

    chooseToOptionChildren(sortSelectTreeItem: ISortSelectTreeItem) {
        if (sortSelectTreeItem.status.chooseFocus) {
            sortSelectTreeItem.status.choose = false;
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.chooseToOptionChildren(children);
        }
        this.resetHaveChildrenStatusFromItem(sortSelectTreeItem);
        sortSelectTreeItem.status.chooseFocus = false;
    }

    optionToChoose() {
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            this.optionToChooseChildren(sortSelectTreeItem);
        }
        this.resetVModel();
    }

    optionToChooseChildren(sortSelectTreeItem: ISortSelectTreeItem) {
        if (sortSelectTreeItem.status.optionFocus) {
            sortSelectTreeItem.status.choose = true;
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.optionToChooseChildren(children);
        }
        this.resetHaveChildrenStatusFromItem(sortSelectTreeItem);
        sortSelectTreeItem.status.optionFocus = false;
    }

    // reset have children status
    resetHaveChildrenStatusFromItem(sortSelectTreeItem: ISortSelectTreeItem) {
        if (sortSelectTreeItem.childrens.length <= 0) {
            return;
        }

        let allchildrenCount = this.calculateAllItemTotalFromItem(
            sortSelectTreeItem
        );
        let chooseChildrenCount = this.calculateChooseItemTotalFormItem(
            sortSelectTreeItem
        );

        if (chooseChildrenCount == 0) {
            sortSelectTreeItem.status.choose = false;
            sortSelectTreeItem.status.childrenChoose = false;
        } else {
            sortSelectTreeItem.status.childrenChoose = true;
            if (allchildrenCount > chooseChildrenCount) {
                sortSelectTreeItem.status.choose = false;
            } else if (allchildrenCount == chooseChildrenCount) {
                sortSelectTreeItem.status.choose = true;
            }
        }
    }

    // 計算所選物件下層數量
    calculateAllItemTotalFromItem(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        for (let children of sortSelectTreeItem.childrens) {
            result++;
            result += this.calculateChooseItemTotalFormItem(children);
        }
        return result;
    }

    calculateChooseItemTotalFormItem(
        sortSelectTreeItem: ISortSelectTreeItem
    ): number {
        let result = 0;
        for (let children of sortSelectTreeItem.childrens) {
            if (children.status.choose) {
                result++;
            }
            result += this.calculateChooseItemTotalFormItem(children);
        }
        return result;
    }

    chooseSortUp() {
        if (this.checkboxClickTrues.length != 1) {
            return;
        }
        if (this.sortIndex.prev != -1) {
            for (let i in this.sortSelectTreeItemList) {
                let sortSelectTreeItem = this.sortSelectTreeItemList[i];
                if (sortSelectTreeItem.value == this.checkboxClickTrues[0]) {
                    let tempChooseItem = JSON.parse(
                        JSON.stringify(sortSelectTreeItem)
                    );
                    this.sortSelectTreeItemList.splice(parseInt(i), 1);
                    this.sortSelectTreeItemList.splice(
                        this.sortIndex.prev,
                        0,
                        tempChooseItem
                    );
                }
            }
        }
        this.checkboxClickTrues = [];
        this.sortIndex.prev = -1;
        this.sortIndex.now = -1;
        this.sortIndex.next = -1;
        this.resetVModel();
    }

    chooseSortDown() {
        this.resetVModel();
    }

    // 重置 selected
    resetSelected() {
        this.selected = [];
        for (let sortSelectTreeItem of this.sortSelectTreeItemList) {
            if (
                sortSelectTreeItem.status.choose ||
                sortSelectTreeItem.status.childrenChoose
            ) {
                this.pushSelected(sortSelectTreeItem.value);
            }
            this.resetSelectedChildren(sortSelectTreeItem);
        }
    }

    resetSelectedChildren(sortSelectTreeItem: ISortSelectTreeItem) {
        if (
            sortSelectTreeItem.status.choose ||
            sortSelectTreeItem.status.childrenChoose
        ) {
            this.pushSelected(sortSelectTreeItem.value);
        }
        for (let children of sortSelectTreeItem.childrens) {
            this.resetSelectedChildren(children);
        }
    }

    // Model connecnt
    resetVModel() {
        // this.resetSelected();
        this.$emit("input", this.selected);
        console.log("Selected result: ", this.selected);
    }

    // chooseSortUp() {
    //     let chooseSelected = this.chooseSelected[0];
    //     if (chooseSelected != undefined) {
    //         let chooseIndex = -1;
    //         let tempChooseItem: any = undefined;
    //         for (let i in this.chooseSelectItem) {
    //             let chooseItem = this.chooseSelectItem[i];
    //             if (chooseItem.value == chooseSelected) {
    //                 chooseIndex = parseInt(i);
    //                 tempChooseItem = JSON.parse(JSON.stringify(chooseItem));
    //                 this.chooseSelectItem.splice(parseInt(i), 1);
    //                 break;
    //             }
    //         }
    //         if (chooseIndex > 0) {
    //         }
    //     }
    // }

    // chooseSortDown() {
    // let chooseSelected = this.chooseSelected[0];
    // if (chooseSelected != undefined) {
    //     let chooseIndex = -1;
    //     let tempChooseItem: any = undefined;
    //     for (let i in this.chooseSelectItem) {
    //         let chooseItem = this.chooseSelectItem[i];
    //         if (chooseItem.value == chooseSelected) {
    //             chooseIndex = parseInt(i);
    //             tempChooseItem = JSON.parse(JSON.stringify(chooseItem));
    //             this.chooseSelectItem.splice(parseInt(i), 1);
    //             break;
    //         }
    //     }
    //     if (chooseIndex < this.chooseSelectItem.length) {
    //         this.chooseSelectItem.splice(
    //             chooseIndex + 1,
    //             0,
    //             tempChooseItem
    //         );
    //     }
    // }
    // }
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