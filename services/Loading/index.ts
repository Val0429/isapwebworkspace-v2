import { Component, Vue } from 'vue-property-decorator';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(VueLoading);

export class Loading {
    loader: any = null;

    constructor() {}

    start() {
        let vue: any = Vue;
        vue.$loading.show();
    }

    stop() {
        let vue: any = Vue;
        vue.$loading.show().hide();
    }
}
