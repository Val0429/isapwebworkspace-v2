<template>
    <div class="box">
        <h1 class="text-center title-margin"> {{_("w_Navigation_Welcome")}}</h1>
        <div class="text-center">

            <img
                width="10%"
                src="../../assets/images/hand.png"
            >
        </div>
        <h4 class="text-center title-margin"> {{_("w_Navigation_ContractorManagementSystem")}}</h4>
        <div class="text-center buttonDiv">
            <button @click="createWork()"> {{_("w_Navigation_CreateWorkOrderRequest")}}
            </button>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class Welcome extends Vue {
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

    createWork() {
        this.$emit("createWork");
    }
}

export default Welcome;
Vue.component("welcome", Welcome);
</script>

<style lang="scss" scoped>
.box {
    margin-top: 200px;
}

.title-margin {
    margin: 20px;
}

.buttonDiv {
    height: 50px;
    button {
        background-color: #36a5e4;
        border-radius: 30px;
        border: 0;
        width: 300px;
        height: 50px;
        font-size: 18px;
        color: white;
    }
}
</style>
