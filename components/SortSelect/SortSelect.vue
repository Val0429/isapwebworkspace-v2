<template>
    <div class="sort-select">
        <div class="select-option-frame">
            <div>{{ _('w_Options') }}</div>
            <div class="sort-select-frame">
                <b-input-group>   
                <b-input
                    v-model="optionSearchText"
                    type="search"
                    @keyup.native.enter="searchOption()"
                />
                 <b-button
                        class="button"
                        variant="default"
                        @click="searchOption()"
                    >
                        <i class="fa fa-search" />
                    </b-button>
                </b-input-group>   
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
                    <b-form-group>
                        <b-form-checkbox
                            v-for="option in optionsSelectItem"
                            v-model="optionsSelected"
                            v-show="option.visible" 
                            class="checkbox-group"
                            name="dragSelectOption"
                            :key="'sort_select__options__key__'+option.value"
                            :value="option.value"
                        >
                            {{ option.text }}
                        </b-form-checkbox>
                    </b-form-group>
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
                        :disabled="disableOptionToChoose()"
                        @click="optionToChoose"
                    >
                        <i class="fa fa-arrow-right" />
                    </b-button>
                </b-col>
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
                
            </b-row>
        </div>
        <div class="select-option-frame">
            <div>{{ _('w_Chooses') }}</div>
            <div class="sort-select-frame">
                <b-input-group> 
                <b-input
                    v-model="chooseSearchText"
                    type="search"
                    @keyup.native.enter="searchChoose()"
                />
                <b-button
                        class="button"
                        variant="default"
                        @click="searchChoose()"
                    >
                        <i class="fa fa-search" />
                    </b-button>
                </b-input-group>  
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
                    <b-form-group>
                        <b-form-checkbox
                            v-for="choose in chooseSelectItem"
                            v-model="chooseSelected"          
                            v-show="choose.visible"                  
                            class="checkbox-group"
                            name="dragSelectChoose"
                            :key="'sort__select__choose__key__'+choose.value"
                            :value="choose.value"
                        >
                            {{ choose.text }}
                        </b-form-checkbox>
                    </b-form-group>
                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { ISortSelectOption } from "./models/ISortSelect";
interface ISortSelectOptionExtended extends ISortSelectOption{
    visible:boolean;
}
@Component({
    components: {}
})
export class SortSelect extends Vue {
    optionSearchText = "";
    chooseSearchText = "";

    optionsSelected: string[] = [];
    chooseSelected: string[] = [];
    optionsSelectItem: ISortSelectOptionExtended[] = [];
    chooseSelectItem: ISortSelectOptionExtended[] = [];

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
    options: ISortSelectOptionExtended[];

    created() {}

    mounted() {
        this.initValue();
    }

    initValue() {
        console.log("initValue");
        this.optionSearchText="";
        this.chooseSearchText="";
        this.optionsSelected = [];
        this.chooseSelected = [];
        this.optionsSelectItem = [];
        this.chooseSelectItem = [];
        for (let option of this.options) {            
            let inValue = false;
            for (let val of this.value) {
                if (val == option.value) {
                    inValue = true;
                    this.chooseSelectItem.push(Object.assign({visible:true},option));
                    break;
                }
            }
            if (!inValue) {
                this.optionsSelectItem.push(Object.assign({visible:true},option));
            }
        }
    }
    @Watch("options", {immediate:true})
    optionsChanged(value){
        console.log("optionsChanged", value);
        console.log("optionsChanged selected", this.value);
        this.initValue();
    }
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
            for (let i in this.chooseSelectItem) {
                let choose = this.chooseSelectItem[i];
                if (chooseSelected == choose.value) {
                    if (parseInt(i) == 0) {
                        result = true;
                    }
                    break;
                }
            }
        } else {
            result = true;
        }
        return result;
    }

    disableChooseSortDown() {
        let result = false;
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined && this.chooseSelected.length == 1) {
            for (let i in this.chooseSelectItem) {
                let choose = this.chooseSelectItem[i];
                if (chooseSelected == choose.value) {
                    if (parseInt(i) == this.chooseSelectItem.length - 1) {
                        result = true;
                    }
                    break;
                }
            }
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

    
    selectAllOption() {
        this.optionsSelected = [];
        for (let option of this.optionsSelectItem.filter(x=>x.visible)) {
            this.optionsSelected.push(option.value);
        }
    }

    clearOptions() {
        this.optionsSelected = [];
    }
    searchOption(visible?:boolean){           
        console.log("this.optionSearchText", this.optionSearchText, visible);
        for(let item of this.optionsSelectItem){            
            item.visible = visible || item.text.search(new RegExp(this.optionSearchText, "i")) >-1;
        }
    }
    searchChoose(visible?:boolean){        
        console.log("this.chooseSearchText", this.chooseSearchText, visible);
        for(let item of this.chooseSelectItem){
            item.visible = visible || item.text.search(new RegExp(this.chooseSearchText, "i")) >-1;
        }
    }
    
    @Watch("chooseSearchText", {immediate:true})
    chooseSearchTextChanged(value, oldValue){
        if(!oldValue || oldValue=="" || value!="")return;
        this.searchChoose(true);
    }
    @Watch("optionSearchText", {immediate:true})
    optionSearchTextChanged(value, oldValue){
        if(!oldValue || oldValue=="" || value!="")return;
        this.searchOption(true);
    }


    selectAllChoose() {
        this.chooseSelected = [];
        for (let choose of this.chooseSelectItem) {
            this.chooseSelected.push(choose.value);
        }
    }

    clearAllChoose() {
        this.chooseSelected = [];
    }

    chooseSortUp() {
        let chooseSelected = this.chooseSelected[0];
        if (chooseSelected != undefined) {
            let chooseIndex = -1;
            let tempChooseItem: any = undefined;
            for (let i in this.chooseSelectItem) {
                let chooseItem = this.chooseSelectItem[i];
                if (chooseItem.value == chooseSelected) {
                    chooseIndex = parseInt(i);
                    tempChooseItem = chooseItem;
                    this.chooseSelectItem.splice(parseInt(i), 1);
                    break;
                }
            }
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
            for (let i in this.chooseSelectItem) {
                let chooseItem = this.chooseSelectItem[i];
                if (chooseItem.value == chooseSelected) {
                    chooseIndex = parseInt(i);
                    tempChooseItem = chooseItem;
                    this.chooseSelectItem.splice(parseInt(i), 1);
                    break;
                }
            }
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
        for (let choose of this.chooseSelected) {
            for (let i in this.chooseSelectItem) {
                let chooseItem = this.chooseSelectItem[i];
                if (choose == chooseItem.value) {
                    this.optionsSelectItem.push(chooseItem);
                    this.chooseSelectItem.splice(parseInt(i), 1);
                    break;
                }
            }
        }
        this.chooseSelected = [];
        this.$emit("input", this.resultList());
    }

    optionToChoose() {
        for (let option of this.optionsSelected) {
            for (let i in this.optionsSelectItem) {
                let optionItem = this.optionsSelectItem[i];
                if (option == optionItem.value) {
                    this.chooseSelectItem.push(optionItem);
                    this.optionsSelectItem.splice(parseInt(i), 1);
                    break;
                }
            }
        }
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

Vue.component("iv-sort-select", SortSelect);
export default SortSelect;
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