/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Vue, Component, Prop, Model } from 'vue-property-decorator';

const emailfilter = {
    bind: (el: any, a, b) => {
        el = el.getElementsByTagName('input')[0];
        let oldvalue = el.value;
        el.addEventListener('blur', (evt) => {
            let newvalue = el.value;
            let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
            main: do {
                if (!regex.test(newvalue)) break;
                oldvalue = newvalue;
                return;
            } while (0);

            let { selectionStart, selectionEnd } = el;
            el.value = oldvalue;
            el.selectionStart = selectionStart - 1;
            el.selectionEnd = selectionEnd - 1;
        });
    },
};

@Component({
    directives: { emailfilter },
})
export class FormEmail extends Vue {
    @Prop({
        type: String,
        required: false,
    })
    label!: string;

    @Model('input', {
        type: String,
        required: false,
    })
    value!: string;

    @Prop({ type: String, required: false })
    placeholder!: string;

    @Prop({ type: String, required: false })
    invalid!: string;
}
export default FormEmail;
