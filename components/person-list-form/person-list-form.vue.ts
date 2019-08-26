import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class PersonListForm extends Vue implements IFormQuick {

    path: string = "/persons";
    tView: string = "_('wb_View')";
    tAdd: string = "_('wb_Add')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = true;
    canPreview?: boolean = true;
    canEdit?: boolean = true;
    canDelete?: boolean = true;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    /**
                     * @uiLabel - No.
                     * @uiType - iv-cell-auto-index
                     */
                    no: any;
                    /**
                     * @uiLabel - ${this._("w_Sex")}
                     */
                    sex: string;
                    /**
                     * @uiLabel - ${this._("w_Service")}
                     */
                    service: boolean;
                    /**
                     * @uiLabel - ${this._("w_Service_Type")}
                     */
                    serviceType: number;
                    /**
                     * @uiLabel - ${this._("w_Service_Description")}
                     */
                    description?: string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
            case EFormQuick.Preview:
                return `
                interface {
                    /**
                     * @uiLabel - ${this._("w_Sex")}
                     * @uiDisabled - ${type === EFormQuick.Preview ? true : false}
                     */
                    sex: ${toEnumInterface({
                        0: "Female",
                        1: "Male"
                    })};
                    /**
                     * @uiLabel - ${this._("w_Service")}
                     * @uiRequired - ${this.$form('quick', 'sex') == 0 ? false : true}
                     * @uiHidden - ${ this.sex == 0 ? true : false }
                     * @uiDisabled - ${type === EFormQuick.Preview ? true : false}
                     */
                    service?: boolean;
                    /**
                     * @uiLabel - ${this._("w_Service_Type")}
                     * @uiRequired - ${ this.sex != 0 && !this.isService ? false : true }
                     * @uiHidden - ${ this.sex == 0 || !this.isService ? true : false }
                     * @uiDisabled - ${type === EFormQuick.Preview ? true : false}
                     */
                    serviceType?: ${toEnumInterface({
                        0: "未服役",
                        1: "已服役",
                        2: "替代役",
                        3: "免役"
                    })};
                    /**
                     * @uiLabel - ${this._("w_Service_Description")}
                     * @uiType - iv-form-textarea
                     * @uiHidden - ${ this.sex == 0 || !this.isService ? true : false }
                     * @uiDisabled - ${type === EFormQuick.Preview ? true : false}
                     */
                    description: string;
                }
                `;
                // return `
                // interface {
                //     /**
                //      * @uiLabel - ${this._("w_Service_Description")}
                //      * @uiType - iv-form-textarea
                //      * @uiHidden - ${ this.isService == true ? false : true }
                //      */
                //     description: string;
                // }
                // `;
                // return `
                // interface {
                //     /**
                //      * @uiLabel - ${this._("w_Sex")}
                //      * @uiType - iv-form-label
                //      */
                //     sex: boolean;
                //     /**
                //      * @uiLabel - ${this._("w_Service")}
                //      * @uiType - iv-form-switch
                //      * @uiDisabled - true
                //      */
                //     service?: boolean;
                //     /**
                //      * @uiLabel - ${this._("w_Service_Type")}
                //      * @uiType - iv-form-label
                //      */
                //     serviceType?: number;
                //     /**
                //      * @uiLabel - ${this._("w_Service_Description")}
                //      * @uiType - iv-form-label
                //      */
                //     description?: string;
                // }
                // `;
        }
    }
    // preAdd() {
    //     return {
    //         title: "Default title"
    //     }
    // }
    // postAdd(row: any) {
    //     row.service = "-";
    //     row.serviceType = "-";
    //     row.description = "-";
    //     return row;
    // }
    // prePreview?(row: any) {
        // throw new Error("Method not implemented.");
    // }
    // preEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }
    // postEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }

    private sex = 0;
    private isService: boolean = false;

    private updateData(data) {
        switch (data.key) {
            case 'sex':
                this.sex = data.value;
            case 'service':
                this.isService = data.value;
        }
    }
    private sendData(arg) {
        console.log('???');
        console.log(arg);
    }
}
export default PersonListForm;