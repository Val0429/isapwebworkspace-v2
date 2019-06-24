<template>
    <div class="fet-card-printer">
        <img
            class="img-logo"
            :src="logoSrc"
        >
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import IconBase64 from "./models/IconBase64";

@Component({
    components: {}
})
class FETCardModel1 extends Vue {
    // Prop
    // @Prop({
    //     type: String,
    //     default: ""
    // })
    // photo: string;

    // @Prop({
    //     type: String,
    //     default: ""
    // })
    // chineseName: string;

    // @Prop({
    //     type: String,
    //     default: ""
    // })
    // englishName: string;

    // @Prop({
    //     type: String,
    //     default: ""
    // })
    // cardNumber: string;

    logoSrc: string = "";

    // Vue step
    created() {
        this.logoSrc = IconBase64.model1Logo;
        console.log(this.logoSrc);
    }

    mounted() {}

    printCard() {
        window.print();
    }
}

export default FETCardModel1;
Vue.component("fet-card-model-1", FETCardModel1);
</script>

<style lang="scss" scoped>
.fet-card-printer {
    width: 100%;
    .img-logo {
        width: 50%;
        margin-left: 25%;
        margin-right: 25%;
    }
}

@media print {
    .fet-card-printer {
        display: block;
    }
}

@media screen {
    // .fet-card-printer {
    //     display: none;
    // }
}
</style>