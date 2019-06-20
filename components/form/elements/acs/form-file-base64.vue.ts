import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import lang from '@/../core/i18n';

@Component
export class FormFile extends Vue {
    @Prop({ type: String, required: false })
    label!: string;

    @Prop({ type: String, required: false })
    placeholder!: string;

    @Prop({ type: String, required: false })
    dropPlaceholder!: string;

    @Prop({ type: String, required: false })
    invalid!: string;

    @Model('input', { required: false })
    value!: string | string[];

    private get innateValue() {
        return this.value instanceof File ? this.value : null;
    }

    private static subscription;
    created() {
        /// do only once
        if (FormFile.subscription) return;
        FormFile.subscription = lang.getObservable()
            .subscribe( (value) => {
                document.documentElement.style
                    .setProperty('--browse-text', `"${lang.translate("wb_Browse")}"`);
            });
    }
    change($event:any){
        let reader: FileReader = new FileReader();
        //Converting Binary Data to base 64        
        reader.onloadend = (e) => {      
            console.log("finished reading file", reader.result);            
            this.$emit('input', reader.result);
        }
        reader.readAsDataURL($event.target.files[0]);
    }
}
export default FormFile;