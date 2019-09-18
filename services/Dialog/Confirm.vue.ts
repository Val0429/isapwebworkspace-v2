import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export class DialogConfirm extends Vue {
    visible: boolean = true;

    @Prop({ type: String, required: true })
    label: string;

    @Prop({ type: String, required: true })
    content: string;

    @Emit('update:visible')
    doUpdateVisible(value: boolean) {
        return value;
    }

    callback() {}

    clickConfirm() {
        this.callback();
        this.doUpdateVisible(false);
    }
}
export default DialogConfirm;
