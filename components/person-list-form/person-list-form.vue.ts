import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class PersonListForm extends Vue implements IFormQuick {

    path: string = "/continental/workcards";
    tView: string = "_('wb_View')";
    tAdd: string = "_('wb_Add')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = true;
    canPreview?: boolean = false;
    canEdit?: boolean = false;
    canDelete?: boolean = false;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
            case EFormQuick.Add:
                return `
                    interface {
                        /*
                         * @uiLabel - ID
                         * @uiHidden - ${type === EFormQuick.Add ? true : false}
                         */
                        pid: string;
                        /*
                         * @uiLabel - ${this._('w_Type')}
                         * @uiHidden - ${type === EFormQuick.Add ? true : false}
                         */
                        workcard_type: string;
                        /*
                         * @uiLabel - ${this._('w_Number')}
                         * @uiColumnGroup - group1
                         * @uiHidden - ${type === EFormQuick.View ? true : false}
                         */
                        number: string;
                        /*
                         * @uiLabel - ${type === EFormQuick.View ? this._('w_Title') : this._('w_Name')}
                         * @uiColumnGroup - ${type === EFormQuick.View ? '' : 'group1'}
                         */
                        name_zh: string;
                        /*
                         * @uiLabel - ${this._('w_Email')}
                         * @uiColumnGroup - group2
                         * @uiHidden - ${type === EFormQuick.View ? true : false}
                         */
                        email: string;
                        /*
                         * @uiLabel - ${this._('w_Card_Number')}
                         * @uiColumnGroup - group2
                         * @uiHidden - ${type === EFormQuick.View ? true : false}
                         */
                        card_number: string;
                        /*
                         * @uiLabel - ${this._('w_Group')}
                         * @uiHidden - ${type === EFormQuick.View ? true : false}
                         */
                        groups?: ${toEnumInterface({
                            'Administrator': 'Administrator',
                            'User': 'User'
                        })};
                        /*
                         * @uiLabel - ${type === EFormQuick.View ? this._('w_Picture') : this._('w_Image')}
                         * @uiType - ${type === EFormQuick.View ? '' : 'iv-form-file'}
                         */
                        photo_base64?: any;
                        /*
                         * @uiLabel - ${this._('w_Actions')}
                         * @uiHidden - ${type === EFormQuick.Add ? true : false}
                         */
                        actions?: any;
                    }
                `;
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

    private readMore() {
        this.$emit('actionIsClick', true);
    }
}
export default PersonListForm;