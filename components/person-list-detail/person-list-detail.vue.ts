import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class PersonListDetail extends Vue {

    private basicData() {
        return `
        interface: {
            image: any;
            name: string;
            id: string;
            type: string;
        }`
    }
}
export default PersonListDetail;