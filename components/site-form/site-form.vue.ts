import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class SiteForm extends Vue implements IFormQuick {

    path: string = "/continental/sites";
    tView: string = "_('wb_View')";
    tAdd: string = "_('w_Inquire')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = false;
    canPreview?: boolean = false;
    canEdit?: boolean = true;
    canDelete?: boolean = false;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
            case EFormQuick.Edit:
                return `
                    interface {
                        /*
                         * @uiLabel - ID
                         * @uiHidden - ${type === EFormQuick.View ? false : true}
                         */
                        caseid: number;
                        /*
                         * @uiLabel - ${this._('w_Region')}
                         * @uiHidden - ${type === EFormQuick.View ? false : true}
                         */
                        region: string;
                        /*
                         * @uiLabel - ${this._('w_Site') + this._('w_Title')}
                         * @uiHidden - ${type === EFormQuick.View ? false : true}
                         */
                        name: string;
                        /*
                         * @uiLabel - ${this._('w_Work_Area')}
                         * @uiHidden - ${type === EFormQuick.View ? false : true}
                         */
                        workarea: string;
                        /*
                         * @uiLabel - ${this._('w_Address')}
                         * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                         */
                        address?: string;
                        /*
                         * @uiLabel - ${this._('w_Lat')}
                         * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                         */
                        latitude?: number;
                        /*
                         * @uiLabel - ${this._('w_Lng')}
                         * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                         */
                        longitude?: number;
                        /*
                         * @uiLabel - ${this._('w_Status')}
                         */
                        case_status?: ${toEnumInterface({
                            0: this._('w_Status_Off'),
                            1: this._('w_Status_On')
                        })};
                        /*
                         * @uiLabel - ${this._('w_Image')}
                         * @uiType - ${type === EFormQuick.Edit ? 'iv-form-file' : ''}
                         */
                        images?: any;                        
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
export default SiteForm;