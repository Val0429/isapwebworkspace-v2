import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export class DialogPrompt extends Vue {
    visible: boolean = true;

    @Prop({ type: String, required: true })
    label: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: Array, required: true })
    options: string[];

    @Emit('update:visible')
    doUpdateVisible(value: boolean) {
        return value;
    }

    callback(index: any) {}

    clickConfirm(index: any) {
        this.callback(index);
        this.doUpdateVisible(false);
    }
}
export default DialogPrompt;
