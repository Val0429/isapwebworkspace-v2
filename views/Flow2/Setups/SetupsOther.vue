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
                        @update:*="updateRemoveWorkDay($event)"
                        @submit="saveRemoveWorkerDaysInf($event)"
                    >
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
import ResponseFilter from "@/services/ResponseFilter";
import RegexServices from "@/services/RegexServices";

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
    } = {
        removeWorkerDays: 0
    };

    created() {
        this.initRemoveWorkerDays();
    }

    mounted() {}

    updateRemoveWorkDay(data) {
        this.inputFormData[data.key] = data.value;
    }

    async initRemoveWorkerDays() {
        await this.$server
            .R("/config")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.vms != undefined &&
                        response.vms.workerExpiredDay != undefined
                    ) {
                        this.inputFormData.removeWorkerDays =
                            response.vms.workerExpiredDay;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async saveRemoveWorkerDaysInf() {
        let param: any = {
            data: {
                vms: {
                    workerExpiredDay: this.inputFormData.removeWorkerDays
                }
            }
        };

        param = RegexServices.trim(param);
        await this.$server
            .C("/config", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_SetupsOther_UpdateSuccess"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    removeWorkerDaysInf() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._(
                     "w_SetupsOther_RemoveWorkerDaysFormLabel"
                 )}
                 * @uiAttrs - { min: 0 }
                 */
                removeWorkerDays?: number;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




