import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class UserGroupForm extends Vue implements IFormQuick {

    path: string = "/users/groups";
    tView: string = "_('wb_View')";
    tAdd: string = "_('wb_Add')";
    tPreview?: string = "";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = true;
    canPreview?: boolean = false;
    canEdit?: boolean = true;
    canDelete?: boolean = true;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /*
                     * @uiLabel - ${this._('w_Group') + this._('w_Title')}
                     */
                    groupname: string;
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
export default UserGroupForm;