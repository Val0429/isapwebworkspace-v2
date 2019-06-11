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

    alert: {
        title: string;
        content: string;
    } = {
        title: "Error Title",
        content: "Error Content<br>Error Content2"
    };

    success: {
        content: string;
    } = {
        content: "Success Content<br>Success Content2"
    };

    error: {
        content: string;
    } = {
        content: "Error Content<br>Error Content2"
    };

    confirm: {
        title: string;
        content: string;
        alertTitle: string;
        alertContent: string;
    } = {
        title: "Confirm title",
        content: "Confirm Content<br>Confirm Content2",
        alertTitle: "Confrim finish",
        alertContent: "You click confirm"
    };

    created() {}
    mounted() {}

    showAlert() {
        Dialog.alert(this.alert.content, this.alert.title);
    }

    showSuccess() {
        Dialog.success(this.success.content);
    }

    showError() {
        Dialog.error(this.error.content);
    }

    showConfirm() {}

    clickConfirm() {
        Dialog.alert(this.confirm.alertContent, this.confirm.alertTitle);
    }
}
</script>

<style lang="scss" scoped>
</style>
