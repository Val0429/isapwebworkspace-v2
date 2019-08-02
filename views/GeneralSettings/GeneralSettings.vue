<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >
                <iv-auto-card :label="_('w_GeneralSettings_RemoveWorkerDaysCardTitle')">
                    <iv-form
                        :interface="removeWorkerDaysInf()"
                        :value="inputFormData"
                        @submit="saveRemoveWorkerDaysInf($event)"
                    >
                    </iv-form>
                </iv-auto-card>

                <iv-auto-card :label="'Login background'">

                    <iv-form
                        :interface="loginBackgroundInf()"
                        @update:*="updateForm($event)"
                        @submit="saveLoginBackground($event)"
                    >

                        <template #imageBase64="{ $attrs, $listeners }">
                            <iv-form-file
                                v-bind="$attrs"
                                v-on="$listeners"
                                v-bind:label="_('w_Upload')"
                                v-bind:placeholder="_('w_Upload')"
                                v-bind:drop-placeholder="_('w_Upload')"
                                accept="image/jpeg,image/png,image/jpg"
                            />
                        </template>

                        <template #imageSrc="{ $attrs, $listeners}">
                            <img
                                class="imgSide"
                                v-if="inputFormData.loginBackgroundSrc"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :src="inputFormData.loginBackgroundSrc"
                            />
                        </template>
                    </iv-form>

                </iv-auto-card>

            </div>

        </iv-auto-transition>

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

@Component({
    components: {}
})
export default class GeneralSettings extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    inputFormData: {
        removeWorkerDays: number;
        loginBackgroundSrc: string;
    } = {
        removeWorkerDays: 0,
        loginBackgroundSrc: ""
    };

    newImg = new Image();
    newImgSrc = "";

    created() {
        this.initRemoveWorkerDays();
        this.initLoginBackground();
    }

    mounted() {}

    initRemoveWorkerDays() {
        // TODO: Morris, Waitting API
        this.inputFormData.removeWorkerDays = 100;
    }

    initLoginBackground() {
        // TODO: Morris, Waitting API
        this.inputFormData.loginBackgroundSrc =
            "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg";
    }

    updateForm(data: any) {
        if (data.key == "imageBase64") {
            this.uploadFile(data.value);
            setTimeout(() => {
                this.inputFormData.loginBackgroundSrc = this.newImg.src;
            }, 300);
        }
        console.log(data);
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Error_FileToLarge"));
                }
            });
        }
    }

    saveRemoveWorkerDaysInf() {
        // TODO: Morris, Waitting API
        Dialog.success(
            `Waitting API, removeWorkerDays: ${this.inputFormData.removeWorkerDays}`
        );
        console.log();
    }

    saveLoginBackground() {
        // TODO: Morris, Waitting API
        Dialog.success(`Waitting API for Login background`);
    }

    removeWorkerDaysInf() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._(
                     "w_GeneralSettings_RemoveWorkerDaysFormLabel"
                 )}
                 * @uiAttrs - { min: 0 }
                 */
                removeWorkerDays?: number;
            }
        `;
    }

    loginBackgroundInf() {
        return `
            interface {
                imageBase64?: any;
                imageSrc?: any;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




