<template>
    <div
        id="app"
        class="app flex-row align-items-center"
    >
        <div class="container">
            <b-row class="justify-content-center">
                <b-col
                    xl="9"
                    md="10"
                >

                    <iv-auto-transition
                        :step="transition.step"
                        :type="transition.type"
                    >

                        <iv-auto-card
                            key="transition_1"
                            v-show="transition.step === 1"
                            :label="'Upload your Self-Portrait'"
                        >
                            <iv-form
                                :interface="IModifyForm()"
                                :value="inputFormData"
                                @update:*="updateForm($event)"
                                @submit="saveForm($event)"
                            >
                                <template #photoImg="{ $attrs, $listeners }">
                                    <img
                                        v-if="inputFormData.photoImage != ''"
                                        class="potrait-form-image"
                                        :src="inputFormData.photoImage"
                                    />
                                </template>
                            </iv-form>
                        </iv-auto-card>

                        <iv-card
                            key="transition_2"
                            v-show="transition.step === 2"
                        >
                            <div class="potrait-success-view">
                                <div class="potrait-success-icon-view">
                                    <i class="fa fa-check-circle"></i>
                                </div>

                                <div class="potrait-success-title">
                                    <h1>{{ _("w_Potrait_SuccessTitle") }}</h1>
                                </div>

                                <div class="potrait-success-content">
                                    <p>{{ _("w_Potrait_SuccessContent_1") }}</p>
                                    <p>{{ _("w_Potrait_SuccessContent_2") }}</p>
                                </div>

                            </div>
                        </iv-card>

                    </iv-auto-transition>

                </b-col>
            </b-row>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import ImageBase64 from "@/services/ImageBase64";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export default class Potrait extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    inputFormData = {
        objectId: "",
        photoSrc: "",
        photoImage: ""
    };

    mountForm: boolean = true;

    created() {
        this.initVerifyCode();
    }

    mounted() {}

    pageToSuccess() {
        Loading.hide();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    // Author: Morris
    initVerifyCode() {
        if (this.$route.query.objectId == undefined) {
            this.$router.push("/login");
            return false;
        }
        if (this.$route.query.objectId != undefined) {
            this.inputFormData.objectId = this.$route.query.objectId as string;
        }
    }

    updateForm(datas: any) {
        if (datas.key == "photoSrc") {
            this.inputFormData.photoSrc = datas.value;
            this.uploadFile(datas.value);
        }
    }

    // image function
    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.inputFormData.photoImage = base64;
                } else {
                    Dialog.error(this._("w_Potrait_ErrorFileToLarge"));
                }
            });
        }
    }

    async saveForm(datas: any) {
        let param = {
            objectId: this.inputFormData.objectId,
            image: this.inputFormData.photoImage
        };

        Loading.show();
        await this.$server
            .U("/visitors/pre-registration", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.pageToSuccess();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Error_FailedToFetch")
                );
            });
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Potrait_Photo")}
                 * @uiPlaceHolder - ${this._("w_Potrait_PhotoPlaceholder")}
                 * @uiType - iv-form-file
                 */
                photoSrc: string;

                photoImg?: any;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.potrait-form-image {
    width: 90%;
    height: 90%;
    max-height: auto;
    min-height: auto;
    margin: 10px 5%;
}

.potrait-success-view {
    text-align: center;
    .potrait-success-icon-view {
        font-size: 10rem;
    }
    .potrait-success-title {
        margin-bottom: 30px;
    }
    .potrait-success-content {
        line-height: 0.8rem;
    }
}
</style>




