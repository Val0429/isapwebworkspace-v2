<template>
    <div class="box">
        <h1 class="text-center title-margin">
            {{_("w_Navigation_PTWNotFound")}}</h1>
        <div class="text-center">

            <img
                width="20%"
                src="../../assets/images/not found.png"
            >
        </div>
        <h4 class="text-center title-margin">{{_("w_Navigation_TheInvitationNumberDoesNotExistOrIsNoLongerOpen")}}
        </h4>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class NotFound extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    label: string;

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    inputData = "Test input data";
    modelData = "";

    created() {
        this.modelData = this.value;
    }

    mounted() {
        this.start();
    }

    start() {
        this.$emit("input", this.inputData);
    }

    putModel() {
        this.$emit("model", this.modelData);
    }
}

export default NotFound;
Vue.component("not-found", NotFound);
</script>

<style lang="scss" scoped>
.box {
    margin-top: 200px;
}

.title-margin {
    margin: 20px;
}
</style>
