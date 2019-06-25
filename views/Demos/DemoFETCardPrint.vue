<template>
    <div class="animated fadeIn">
        <b-button
            @click="printCard"
            style="position:fixed; top: 100px; left: 100p; z-index :10000;"
        >
            Print
        </b-button>
        <fet-card-model-1
            ref="fetCardModel1"
            class="card-model"
            :photo="photo"
            :chineseName="chineseName"
            :englishName="englishName"
            :cardNumber="cardNumber"
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
    photo =
        "https://ttshow.tw/media/uploads/2019/01/16/dab20f8dly1fyoupdg5l7j21sc2e2e84.jpg";
    chineseName = "鞠婧禕";
    englishName = "Ju JingYi";
    cardNumber = "KI-1010";

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
