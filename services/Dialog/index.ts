import Alert from './Alert.vue';
import Confirm from './Confirm.vue';
import Success from './Success.vue';
import Prompt from './Prompt.vue';
import Error from './Error.vue';

export class Dialog {
    alert(content: string, label: string) {
        new Alert({
            propsData: {
                label: label,
                content: content,
            },
        }).$modal();
    }

    confirm(content: string, label: string, callback: any) {
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

    prompt(content: string, label: string, options: string[], callback: any) {
        new Prompt({
            propsData: {
                label: label,
                options: options,
                content: content,
            },
            methods: {
                callback: callback,
            },
        }).$modal();
    }

    success(content: string) {
        new Success({
            propsData: {
                content: content,
            },
        }).$modal();
    }

    error(content: string) {
        new Error({
            propsData: {
                content: content,
            },
        }).$modal();
    }
}
export default new Dialog();
