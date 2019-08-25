import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import CustomView from './lib/list.vue';
import CustomAdd from '@/../components/form/helpers/form-quick/lib/add.vue';
import { EFormQuick, IFormQuick } from '@/../components/form';

export interface IFormQuick2 extends IFormQuick{
    onFilterSubmit($event?:any):void;
    filterVisible:boolean;
    viewChange($event:any):void;
    params:any;
    filterInterface():string;
} 

@Component({
    components: { CustomView, CustomAdd },
} as any)
/// 0) class name
export class FormQuick extends Vue {
    /// private helpers
    @Prop({
        type: Boolean,
        required: false
    })
    private canAdd: boolean;
    @Prop({
        required: false
    })
    private doExport: any;
    @Prop({
        type: Boolean,
        required: false
    })
    private canEdit: boolean;
    @Prop({
        type: Boolean,
        required: false
    })
    private canPreview: boolean;
    @Prop({
        type: Boolean,
        required: false
    })
    private canDelete: boolean;
    @Prop({
        type: Boolean,
        required: false
    })
    private allowEdit: boolean;
    private get server() {
        return (this.$parent as any).server || this.$server;
    }
    
    selectedRows($event){
        this.$emit("selectedRows", $event);
    }
    private view: EFormQuick = EFormQuick.View;
    private editRow: any = null;
    private doAddSuccess() {
        this.view = EFormQuick.View;
        (this.$refs.view as any).reload();
    }
    private doAdd(data) {
        (async () => {
            try {
                let parent = this.$parent as any;
                data = parent.postAdd ? (await parent.postAdd(data) || data) : data;
                let result = await this.server.C((this.$parent as any).path as any, data);
                this.doAddSuccess();
            } catch(e) {
                alert(e.body);
            }
        })();
    }
    private doEdit(data) {
        (async () => {
            try {
                let parent = this.$parent as any;
                data = parent.postEdit ? (await parent.postEdit(data) || data) : data;
                let result = await this.server.U((this.$parent as any).path as any, {...data, objectId: data.objectId } );
                this.doAddSuccess();
            } catch(e) {
                alert(e.body);
            }
        })();
    }
    private async prepareEdit(row) {
        let parent = this.$parent as any;
        let goView = this.canPreview ? EFormQuick.Preview : EFormQuick.Edit;
        let func = goView === EFormQuick.Preview ? parent.prePreview : parent.preEdit;
        row = func ? (await func(row) || row) : row;
        this.editRow = { ...row, objectId: row.objectId };
        this.view = goView;
    }

    private relatedSlots(name: 'view' | 'add', isScoped?: boolean): { originalName: string, name: string }[] {
        let slots = isScoped ? this.$scopedSlots : this.$slots;
        let rtn = [];
        let regex = new RegExp(`^${name}\.`);
        for (let key in slots) {
            if (!regex.test(key)) continue;
            rtn.push({
                originalName: key,
                name: key.replace(regex, "")
            });
        }
        return rtn;
    }
        /// view watcher
    @Watch('view', {immediate: true})
    private onViewChanged(value: any, oldValue: any) {
        if (value) {            
            if(value!==oldValue)
            this.$emit("viewChange", this.view);
        }
    }
    
    private emitUpdate(data: { key: string, value: any }) {
        let { key, value } = data;
        if (key.indexOf(".") < 0) this.$emit(`update:${key}`, value);
        else this.$emit(`update:${key.replace(/\./g, ':')}`, value);
        this.$emit(`update:*`, { key, value });
    }
}
export default FormQuick;