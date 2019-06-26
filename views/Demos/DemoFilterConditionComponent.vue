<template>
    <div>

        <iv-card
            :visible="true"
            :label="_('w_ReportFilterConditionComponent_')"
        >

<!--            @submit="doSubmit($event)"-->
            <iv-form
                :interface="ITabForm4()"
                @update:*="whenSelectCardTemplate($event)"
            >

                <template #cardTemplate="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.cardTemplate"
                        class="col-md-6"
                    ></iv-form-selection>
                </template>

                <template
                    #imageSrcCard="{ $attrs, $listeners}"
                    v-if="imageSrcCard"
                >
<!--                    <label class="col-md-12">-->
<!--                        {{_("w_Member_CardPhoto")}}-->
<!--                    </label>-->
                    <img
                        class="col-md-6 imgCard"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :src="imageSrcCard"
                    />
                </template>

            </iv-form>

        </iv-card>


        <!-- 父元件的data='傳到子元件的data' -->
        <filter_condition
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter_condition>

        <div class="h-25"></div>

        <analysis_filter_in_out
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter_in_out>

        <analysis_filter
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter>

        <b-button
            @click="modalShow = !modalShow"
        >
            {{ _('w_ReportTemplate_Recipient') }}
        </b-button>

        <div class="h-25"></div>

        <recipient
            :modalShow="modalShow"
            @user-data="receiveUserData"
            @return-modalShow="receiveModalShowData"
        ></recipient>


    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import CardTemplateBase64 from '@/components/FET_Card/cardTemplateBase64';

enum EDeviceMode {
    peopleCounting = "peopleCounting",
    dwellTime = "dwellTime",
    demographic = "demographic",
    heatmap = "heatmap",
    visitor = "visitor",
    humanDetection = "humanDetection"
}

enum ITemplateCard {
    permanent = '職員識別證',
    contract  = '約聘職員識別證',
}

@Component
export default class DemoFilterConditionComponent extends Vue {

    cardTemplateSelectItem: any = {
        "permanent": ITemplateCard.permanent,
        "contract": ITemplateCard.contract,
};

    newImgCard = new Image();
    imageSrcCard = '';
    //
    modalShow: boolean = false;

    // 接收 submit 相關
    filterData: any = {};
    userData: any = [];

    // 網子元件傳資料
    deviceMode: string = EDeviceMode.demographic;

    inputFormData:any = {
        cardTemplate: '',
    };

    created() {}

    mounted() {}

    receiveFilterData(data) {
        this.filterData = data;
        Vue.set(this.filterData, "siteIds0", data.siteIds[0]);
    }

    receiveUserData(data) {
        this.userData = data;
    console.log('this.userData - ', this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    whenSelectCardTemplate(data) {
        switch (data.key) {
            case 'cardTemplate':
                switch (data.value) {
                    case "permanent":
                        this.imageSrcCard = CardTemplateBase64.permanent;
                        console.log(' - ', data.value);
                        break;
                    case "contract":
                        this.imageSrcCard = CardTemplateBase64.contract;
                        console.log(' - ', data.value);
                        break;
                }
                break;
        }
    }


    ITabForm4() {
        return `
            interface {

                /**
                 * @uiLabel - Member_CardTemplate
                 * @uiColumnGroup - row13
                 */
                cardTemplate?: ${toEnumInterface(
            this.cardTemplateSelectItem as any,
            false
        )};

               /**
                * @uiColumnGroup - row13
                */
                imageSrcCard?:any;
            }
        `;
    }
}
</script>
<style lang="scss" scoped>
    .imgSide {
        max-width: 200px;
        min-width: 200px;
        max-height: none;
        min-height: auto;
        height: 100%;
        margin-bottom: 10px;
    }
    .imgCard {
        max-width: 250px;
        min-width: 200px;
        max-height: none;
        min-height: auto;
        height: 100%;
        margin-bottom: 10px;
    }
</style>
