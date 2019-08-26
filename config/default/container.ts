import { VueConstructor } from 'vue';
import { Basic } from '@/../containers/Basic';
//import { CoreUI } from '@/../containers/CoreUI';
import CoreUI from '@/container/CoreUI.vue';
import { Config } from '@/../config/default/container';

var config: Config = {
    container: CoreUI
}
export default config;
