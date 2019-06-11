import Alert from './Alert.vue';
import Success from './Success.vue';
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

    confirm() {}
}
export default new Dialog();
