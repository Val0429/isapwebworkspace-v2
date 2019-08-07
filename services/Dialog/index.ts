import Alert from './Alert.vue';
import Confirm from './Confirm.vue';
import Success from './Success.vue';
import Error from './Error.vue';

export class Dialog {
    async alert(content: string, label: string) {
        new Alert({
            propsData: {
                label: label,
                content: content,
            },
        }).$modal();
    }

    async confirm(content: string, label: string, callback: any) {
        new Confirm({
            propsData: {
                label: label,
                content: content,
            },
            methods: {
                callback: callback,
            },
        }).$modal();
    }

    async success(content: string) {
        new Success({
            propsData: {
                content: content,
            },
        }).$modal();
    }

    async error(content: string) {
        new Error({
            propsData: {
                content: content,
            },
        }).$modal();
    }
}
export default new Dialog();
