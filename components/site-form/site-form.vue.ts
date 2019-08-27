import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class SiteForm extends Vue implements IFormQuick {

    path: string = "/continental/sites";
    tView: string = "_('wb_View')";
    tAdd: string = "_('wb_Add')";
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
                     */
                    caseid: number;
                    /*
                     * @uiLabel - ${this._('w_Region')}
                     */
                    region: string;
                    /*
                     * @uiLabel - ${this._('w_Site') + this._('w_Title')}
                     */
                    name: string;
                    /*
                     * @uiLabel - ${this._('w_Work_Area')}
                     */
                    workarea: string;
                    /*
                     * @uiLabel - ${this._('w_Status')}
                     */
                    case_status: ${toEnumInterface({
                        '0': '關閉',
                        '1': '開啟'
                    })};
                    /*
                     * @uiLabel - ${this._('w_Image')}
                     */
                    images: any;
                    /*
                     * @uiLabel - ${this._('w_Address')}
                     * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                     */
                    address: string;
                    /*
                     * @uiLabel - ${this._('w_Lat')}
                     * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                     */
                    latitude: number;
                    /*
                     * @uiLabel - ${this._('w_Lng')}
                     * @uiHidden - ${type === EFormQuick.Edit ? false : true}
                     */
                    longitude: number;
                }`;
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
export default SiteForm;