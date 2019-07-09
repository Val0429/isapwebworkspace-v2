import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export class DialogAlert extends Vue {
    visible: boolean = true;

    @Prop({ type: String, required: true })
    label: string;

    @Prop({ type: String, required: true })
    content: string;

    @Emit('update:visible')
    doUpdateVisible(value: boolean) {
        return value;
    }
}
export default DialogAlert;
