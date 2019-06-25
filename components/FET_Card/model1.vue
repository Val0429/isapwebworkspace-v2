<template>
    <div class="fet-card-printer">
        <img
            class="fet-card-img-logo"
            :src="logoSrc"
        >
        <img
            class="fet-card-img-photo"
            :src="photo"
        >
        <div class="fet-card-chinese-name">{{chineseName}}</div>
        <div class="fet-card-english-name">{{englishName}}</div>
        <div class="fet-card-number">{{cardNumber}}</div>
        <div class="fet-card-footer">
            <div class="fet-card-footer-red"></div>
            <div class="fet-card-footer-gradual"></div>
        </div>
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
    @Prop({
        type: String,
        default: ""
    })
    photo: string;

    @Prop({
        type: String,
        default: ""
    })
    chineseName: string;

    @Prop({
        type: String,
        default: ""
    })
    englishName: string;

    @Prop({
        type: String,
        default: ""
    })
    cardNumber: string;

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
// 55mm, 86mm, 0.6395, 1.5636
.fet-card-printer {
    position: relative;
    width: 55mm;
    height: 86mm;
    .fet-card-img-logo {
        width: 33mm;
        position: absolute;
        top: 8mm;
        left: 11mm;
    }
    .fet-card-img-photo {
        width: 23mm;
        max-height: 30mm;
        position: absolute;
        top: 27mm;
        left: 16mm;
    }
    .fet-card-chinese-name {
        width: 100%;
        height: 4mm;
        font-size: 4mm;
        text-align: center;
        position: absolute;
        top: 61mm;
    }
    .fet-card-english-name {
        width: 100%;
        height: 3mm;
        font-size: 3mm;
        text-align: center;
        position: absolute;
        top: 67mm;
    }
    .fet-card-number {
        width: 100%;
        height: 2.5mm;
        font-size: 2.5mm;
        text-align: center;
        position: absolute;
        top: 73mm;
    }
    .fet-card-footer {
        position: absolute;
        width: 100%;
        height: 8mm;
        top: 79mm;
        .fet-card-footer-red {
            width: 100%;
            height: 8mm;
            background-color: #e6240f;
        }
        .fet-card-footer-gradual {
            width: 40mm;
            height: 8mm;
            position: absolute;
            z-index: 10;
            right: 0mm;
            top: 0mm;
            background-color: #ad1500;
            background: linear-gradient(135deg, transparent 8mm, #ad1500 0) top
                left;
            // border-top-left-radius: 12mm;
        }
    }
}

@media print {
    .fet-card-printer {
        display: block;
    }
    @page {
        size: 55mm 86mm portrait;
    }
}

@media screen {
    // .fet-card-printer {
    //     display: none;
    // }
}
</style>