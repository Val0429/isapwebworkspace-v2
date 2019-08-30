import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class PersonListDetail extends Vue {

    @Prop({ type: Array})
    personListData: any[];

    private basicData() {
        return `
        interface: {
            photo_base64: any;
            name_zh: string;
            pid: string;
            workcard_type: string;
        }`
    }

    private mounted() {
        console.log('prop', this.personListData)
    }
}
export default PersonListDetail;