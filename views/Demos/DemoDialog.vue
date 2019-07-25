<template>
    <div class="animated fadeIn">
        <div class="demo-control-row-view">

            <b-row>
                <b-col :cols="buttonCols">
                    <b-button @click="showAlert">Show Alert</b-button>
                </b-col>
                <b-col :cols="buttonCols">
                    <b-button @click="showSuccess">Show Success</b-button>
                </b-col>
                <b-col :cols="buttonCols">
                    <b-button @click="showError">Show Error</b-button>
                </b-col>
                <b-col :cols="buttonCols">
                    <b-button @click="showConfirm">Show Confirm</b-button>
                </b-col>
            </b-row>

        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

@Component({
    components: {}
})
export default class DemoDialog extends Vue {
    buttonCols = "3";

    alertText: {
        title: string;
        content: string;
    } = {
        title: "Error Title",
        content: "Error Content<br>Error Content2"
    };

    successText: {
        content: string;
    } = {
        content: "Success Content<br>Success Content2"
    };

    errorText: {
        content: string;
    } = {
        content: "Error Content<br>Error Content2"
    };

    confirmText: {
        title: string;
        content: string;
        alertTitle: string;
        alertContent: string;
    } = {
        title: "Confirm title",
        content: "Confirm Content<br>Confirm Content2",
        alertTitle: "Confirm finish",
        alertContent: "You click confirm"
    };

    created() {}
    mounted() {}

    showAlert() {
        Dialog.alert(this.alertText.content, this.alertText.title);
    }

    showSuccess() {
        Dialog.success(this.successText.content);
    }

    showError() {
        Dialog.error(this.errorText.content);
    }

    showConfirm() {
        Dialog.confirm(this.confirmText.content, this.confirmText.title, () => {
            this.clickConfirm();
        });
    }

    clickConfirm() {
        Dialog.alert(
            this.confirmText.alertContent,
            this.confirmText.alertTitle
        );
    }
}
</script>

<style lang="scss" scoped>
</style>
