import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class StrangerListForm extends Vue implements IFormQuick {

    path: string = "/continental/unrecognizeduser";
    tView: string = "_('m_Persons_Stranger_List')";
    tAdd: string = "_('wb_Add')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = false;
    canPreview?: boolean = false;
    canEdit?: boolean = false;
    canDelete?: boolean = false;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
                return `
                    interface {
                        /**
                         * @uiLabel - ${this._("w_Picture")}
                         */
                        snapshot: string;
                        /**
                         * @uiLabel - ${this._("w_Timestamp")}
                         */
                        updatedAt: Date;
                        /**
                         * @uiLabel - ${this._("w_Site")}
                         */
                        workplace: string;
                        /**
                         * @uiLabel - ${this._("w_Work_Area")}
                         */
                        channel: string;
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
export default StrangerListForm;