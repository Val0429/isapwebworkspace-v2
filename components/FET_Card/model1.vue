<template>

    <div
        ref="fetCardScreen"
        style="width: 100%;"
        :style="{'height': (parentWidthScale * 86).toString() + 'px'}"
    >
        <div
            ref="fetCard"
            class="fet-card-printer"
            :style="{'height': (parentWidthScale * 86).toString() + 'px'}"
        >
            <img
                class="fet-card-img-logo"
                :style="{'top': (parentWidthScale * 8).toString() + 'px'}"
                :src="logoSrc"
            >

            <img
                class="fet-card-img-photo"
                :style="{'top': (parentWidthScale * 27).toString() + 'px'}"
                :src="photo"
            >

            <div
                class="fet-card-chinese-name"
                :style="{
                    'height': (parentWidthScale * 4).toString() + 'px',
                    'font-size': (parentWidthScale * 4).toString() + 'px',
                    'top': (parentWidthScale * 61).toString() + 'px',
                }"
            >{{chineseName}}</div>

            <div
                class="fet-card-english-name"
                :style="{
                    'height': (parentWidthScale * 3).toString() + 'px',
                    'font-size': (parentWidthScale * 3).toString() + 'px',
                    'top': (parentWidthScale * 67).toString() + 'px',
                }"
            >{{englishName}}</div>

            <div
                class="fet-card-card-number"
                :style="{
                    'height': (parentWidthScale * 2).toString() + 'px',
                    'font-size': (parentWidthScale * 2).toString() + 'px',
                    'top': (parentWidthScale * 72).toString() + 'px',
                }"
            >{{cardNumber}}</div>

            <img
                class="fet-card-footer"
                :src="footerSrc"
            >

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
    footerSrc: string = "";

    parentWidthScale = 0;

    // Vue step
    created() {
        this.initSrc();
    }

    mounted() {
        this.initCardStyle();
        this.initWindowResize();
    }

    destroyed() {
        window.onresize = null;
    }

    initSrc() {
        this.logoSrc = IconBase64.model1Logo;
        this.footerSrc = IconBase64.model1Footer;
    }

    initWindowResize() {
        window.onresize = this.initCardStyle;
    }

    initCardStyle() {
        let fetCardRef: any = this.$refs.fetCardScreen;
        if (fetCardRef == undefined) {
            console.log("Not find FET Card");
            return false;
        }

        // get parent width
        let fetCardRefWidth = fetCardRef.clientWidth;

        fetCardRefWidth = 1070;
        this.parentWidthScale = parseInt(fetCardRefWidth) / 55;
        console.log("parentWidthScale", this.parentWidthScale);
    }

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
    width: 100%; // 55mm
    // height: 86mm;
    display: block;
    position: relative;
    top: 0;
    .fet-card-img-logo {
        width: 60%; // 33mm
        position: absolute;
        left: 20%; // 11mm
        // top: 8mm; // 8mm
    }
    .fet-card-img-photo {
        width: 41.8%; // 23mm
        // max-height: 76.7%; // 30mm
        position: absolute;
        left: 29%; // 16mm
        // top: 27mm; // 27mm
    }
    .fet-card-chinese-name {
        width: 100%;
        // height: 4mm; // 4mm
        font-size: 4mm; // 4mm
        text-align: center;
        position: absolute;
        // top: 61mm; // 61mm
    }
    .fet-card-english-name {
        width: 100%;
        // height: 3mm; // 3mm
        font-size: 3mm; // 3mm
        text-align: center;
        position: absolute;
        // top: 67mm; // 67mm
    }
    .fet-card-card-number {
        width: 100%;
        // height: 2.5mm; // 2.5mm
        font-size: 2.5mm; // 2.5mm
        text-align: center;
        position: absolute;
        // top: 73mm; // 73mm
    }
    .fet-card-footer {
        position: absolute;
        width: 100%;
        // height: 8mm; // 8mm
        bottom: 0;
    }
}

@media print {
    @page {
        margin: 0;
    }

    body {
        width: 992px !important;
        min-width: 992px !important;
        max-width: 992px !important;
    }

    // 55mm, 86mm, 0.6395, 1.5636
    .fet-card-printer {
        width: 100%; // 55mm
        // height: 86mm;
        display: block;
        position: relative;
        top: 0;
        .fet-card-img-logo {
            width: 60%; // 33mm
            position: absolute;
            left: 20%; // 11mm
            // top: 8mm; // 8mm
        }
        .fet-card-img-photo {
            width: 41.8%; // 23mm
            // max-height: 76.7%; // 30mm
            position: absolute;
            left: 29%; // 16mm
            // top: 27mm; // 27mm
        }
        .fet-card-chinese-name {
            width: 100%;
            // height: 4mm; // 4mm
            font-size: 4mm; // 4mm
            text-align: center;
            position: absolute;
            // top: 61mm; // 61mm
        }
        .fet-card-english-name {
            width: 100%;
            // height: 3mm; // 3mm
            font-size: 3mm; // 3mm
            text-align: center;
            position: absolute;
            // top: 67mm; // 67mm
        }
        .fet-card-card-number {
            width: 100%;
            // height: 2.5mm; // 2.5mm
            font-size: 2.5mm; // 2.5mm
            text-align: center;
            position: absolute;
            // top: 73mm; // 73mm
        }
        .fet-card-footer {
            position: absolute;
            width: 100%;
            // height: 8mm; // 8mm
            bottom: 0;
            // top: 79mm;
            .fet-card-footer-red {
                position: absolute;
                width: 100%;
                height: 100%; // 8mm
                background-color: #e6240f;
            }
            .fet-card-footer-gradual {
                width: 72.7%; // 40mm
                height: 100%; // 8mm
                position: absolute;
                z-index: 10;
                right: 0;
                top: 0;
                background-color: #ad1500;
                background: linear-gradient(135deg, transparent 8mm, #ad1500 0)
                    top left; // 8mm
            }
        }
    }
}

@media screen {
    // .fet-card-printer {
    //     display: none;
    // }
}
</style>