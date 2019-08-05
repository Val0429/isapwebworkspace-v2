<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >

            <template #qrCode>
                <div v-if="qrCode">
                    <img :src="qrCode" alt="">
                    <p></p>
                </div>
            </template>

        </iv-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
    import { toEnumInterface } from '@/../core'

    @Component({
        components: {}
    })
    export class Step8 extends Vue {

        accessGroupSelectItem: any = {};

        inputFormData: any = {
            startDate: new Date(),
            endDate: new Date(),
            accessGroup: ''
        };

        // TODO: wait api
        // qrCode: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/QRcode_image.svg/220px-QRcode_image.svg.png';
        qrCode: string = '';

        created() {
        }

        mounted() {
            this.initSelectItem();
            this.initAccessGroupSelectItem();
        }

        initSelectItem() {
        }


        async initAccessGroupSelectItem() {

            this.accessGroupSelectItem = {};
            let tempAccessGroupSelectItem = {};

            // TODO: wait api
            // await this.$server
            //     .R("/")
            //     .then((response: any) => {
            //         ResponseFilter.successCheck(this, response, (response: any) => {
            //             for (const returnValue of response) {
            //                 tempAccessGroupSelectItem[returnValue.objectId] =
            //                     returnValue.name;
            //             }
            //             this.accessGroupSelectItem = tempAccessGroupSelectItem;
            //         });
            //     })
            //     .catch((e: any) => {
            //         return ResponseFilter.catchError(this, e);
            //     });

        }

        updateInputFormData(data) {
            switch (data.key) {

                case 'startDate':
                    this.inputFormData.startDate = data.value;
                    break;
                case 'endDate':
                    this.inputFormData.endDate = data.value;
                    break;
                case 'accessGroup':
                    this.inputFormData.accessGroup = data.value;
                    break;
            }

            this.$emit('step8', this.inputFormData)
        }


        IAddForm() {
            return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step8_ValidityOfApproval")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                startDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_To")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                endDate?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 */
                accessGroup?:  ${toEnumInterface(this.accessGroupSelectItem as any, false)};


                qrCode?: any;


            }
        `;
        }
    }

    export default Step8;
    Vue.component("step8", Step8);
</script>

<style lang="scss" scoped>
</style>
