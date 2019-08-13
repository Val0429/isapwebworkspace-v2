import { Component, Vue } from 'vue-property-decorator';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(VueLoading);

export class Loading {
    loader = null;
    constructor() {}
    show() {
        let self: any = Vue;
        this.loader = self.$loading.show({
            // Optional parameters
            // canCancel: true,
        });
    }
    hide() {
        if (this.loader != null) {
            this.loader.hide();
        }
    }
}
export default new Loading();
