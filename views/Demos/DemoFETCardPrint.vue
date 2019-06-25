<template>
    <div class="animated fadeIn">
        <b-button @click="printCard1">
            Print Model 1
        </b-button>
        <fet-card-model-1
            v-if="modelType == 1"
            ref="fetCardModel1"
            class="card-model"
            :photo="photo"
            :chineseName="chineseName"
            :englishName="englishName"
            :cardNumber="cardNumber"
        >
        </fet-card-model-1>

        <br>
        <br>
        <br>

        <b-button @click="printCard2">
            Print Model 2
        </b-button>

        <fet-card-model-2
            v-if="modelType == 2"
            ref="fetCardModel2"
            class="card-model"
            :photo="photo"
            :chineseName="chineseName"
            :englishName="englishName"
            :cardNumber="cardNumber"
            :footerTitle="model2footerTitle"
        >
        </fet-card-model-2>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import FETCardModel1 from "@/components/FET_Card/model1.vue";
import FETCardModel2 from "@/components/FET_Card/model2.vue";

@Component({
    components: {
        FETCardModel1,
        FETCardModel2
    }
})
export default class DemoFETCardPrint extends Vue {
    photo =
        "https://ttshow.tw/media/uploads/2019/01/16/dab20f8dly1fyoupdg5l7j21sc2e2e84.jpg";
    chineseName = "鞠婧禕";
    englishName = "Ju JingYi";
    cardNumber = "KI-1010";

    model2footerTitle = "約聘工作人員";

    modelType = 0;

    created() {}
    mounted() {}

    printCard1() {
        this.modelType = 1;
        this.readyToPrint();
    }

    printCard2() {
        this.modelType = 2;
        this.readyToPrint();
    }

    readyToPrint() {
        setTimeout(window.print, 1000);
    }
}
</script>

<style lang="scss" scoped>
</style>
