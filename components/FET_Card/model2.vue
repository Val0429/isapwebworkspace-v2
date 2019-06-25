<template>

    <div class="fet-card-screen">
        <div
            ref="fetCard"
            class="fet-card-printer"
        >
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

            <div class="fet-card-card-number">{{cardNumber}}</div>

            <div class="fet-card-footer">
                <img
                    :src="footerSrc"
                    class="fet-card-footer-image"
                >
                <div class="fet-card-footer-title">
                    {{ footerTitle }}
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import IconBase64 from "./models/IconBase64";

@Component({
    components: {}
})
class FETCardModel2 extends Vue {
    // Prop start
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

    @Prop({
        type: String,
        default: ""
    })
    footerTitle: string;
    // Prop end

    logoSrc: string = "";
    footerSrc: string = "";

    parentWidthScale = 0;

    // Vue step
    created() {
        this.initSrc();
    }

    mounted() {}

    destroyed() {}

    initSrc() {
        this.logoSrc = IconBase64.model2Logo;
        this.footerSrc = IconBase64.model2Footer;
    }
}

export default FETCardModel2;
Vue.component("fet-card-model-2", FETCardModel2);
</script>

<style lang="scss" scoped>
.fet-card-screen {
    position: fixed;
    left: -1000;
    top: -1000;
    height: 1673px;
}

@media print {
    .fet-card-screen {
        position: static;
    }

    // 55mm, 86mm, 0.6395, 1.5636
    .fet-card-printer {
        width: 100%; // 55mm
        height: 1673px; // 86mm;
        display: block;
        position: relative;
        top: 0;
        .fet-card-img-logo {
            width: 60%; // 33mm
            position: absolute;
            left: 20%; // 11mm
            top: 156px; // 8mm
        }
        .fet-card-img-photo {
            width: 41.8%; // 23mm
            position: absolute;
            left: 29%; // 16mm
            top: 525px; // 27mm
        }
        .fet-card-chinese-name {
            width: 100%;
            height: 78px; // 4mm
            font-size: 78px; // 4mm
            text-align: center;
            position: absolute;
            top: 1186px; // 61mm
        }
        .fet-card-english-name {
            width: 100%;
            height: 58px; // 3mm
            font-size: 58px; // 3mm
            text-align: center;
            position: absolute;
            top: 1303px; // 67mm
        }
        .fet-card-card-number {
            width: 100%;
            height: 39px; // 2.5mm
            font-size: 39px; // 2.5mm
            text-align: center;
            position: absolute;
            top: 1400px; // 73mm
        }
        .fet-card-footer {
            position: relative;
            width: 100%;
            height: 100px; // 8mm
            top: 1520px; // top: 79mm;
            .fet-card-footer-image {
                position: absolute;
                width: 100%;
                height: 100px;
                top: 0;
                left: 0;
            }
            .fet-card-footer-title {
                position: absolute;
                z-index: 100;
                width: 100%;
                height: 60px; // 8mm
                top: 20px; // top: 79mm;
                text-align: center;
                font-size: 35px; // 2.5mm
                color: #fff;
            }
        }
    }
}

@media screen {
    .fet-card-printer {
        display: none;
    }
}
</style>