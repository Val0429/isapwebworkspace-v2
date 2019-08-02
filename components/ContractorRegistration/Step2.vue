<template>
    <div>
        Components Empty
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component({
    components: {}
})
export class Step2 extends Vue {

    tenantSelectItem: any = {};
    workCategorySelectItem: any = {};

    created() {
    }

    mounted() {
    }


    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 * @uiPlaceHolder - ${this._("w_Invitation_PTWID")}
                 * @uiColumnGroup - row1
                 */
                ptwId?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Email_Placeholder")}
                 * @uiColumnGroup - row2
                 */
                email?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 * @uiColumnGroup - row2
                 */
                tenant?:  ${toEnumInterface(this.tenantSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 * @uiColumnGroup - row2
                 */
                workCategory?:  ${toEnumInterface(this.workCategorySelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Unit")}
                 * @uiColumnGroup - row3
                 */
                unit?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContactPerson")}
                 * @uiPlaceHolder - ${this._("w_Invitation_ContactPerson")}
                 * @uiColumnGroup - row3
                 */
                contactPerson?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Contractor")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Contractor")}
                 * @uiColumnGroup - row3
                 */
                contractor?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkersName")}
                 * @uiPlaceHolder - ${this._("w_Invitation_WorkersName")}
                 * @uiColumnGroup - row3
                 */
                workersName?: string;
            }
        `;
    }
}

export default Step2;
Vue.component("step2", Step2);
</script>

<style lang="scss" scoped>
</style>
