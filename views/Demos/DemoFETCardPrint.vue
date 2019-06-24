<template>
    <div class="animated fadeIn">
        <b-button @click="printCard">
            Print
        </b-button>
        <fet-card-model-1
            ref="fetCardModel1"
            class="card-model"
        >
        </fet-card-model-1>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import FETCardModel1 from "@/components/FET_Card/model1.vue";

@Component({
    components: {
        FETCardModel1
    }
})
export default class DemoFETCardPrint extends Vue {
    created() {}
    mounted() {}
    printCard() {
        let model: any = this.$refs.fetCardModel1;
        model.printCard();
    }
}
</script>

<style lang="scss" scoped>
</style>
