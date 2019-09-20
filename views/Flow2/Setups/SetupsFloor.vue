<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- List -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label=" _('w_Floor_List') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/flow2/floors' }"
                    @selected="selectedItem($event)"
                >

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label=" _('w_Floor_View') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >
                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component({
    components: {}
})
export default class SetupsFloor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    selectedDetail: any = [];
    tableMultiple: boolean = true;
    inputFormData: any = {
        objectId: "",
        building: "",
        buildingName: "",
        name: "",
        floor: 0
    };

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            building: "",
            buildingName: "",
            name: "",
            floor: 0
        };
    }

    getInputData() {
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                building: param.building.objectId,
                buildingName: param.building.name,
                name: param.name,
                floor: param.floor
            };
        }
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                building: interface {
                    /**
                     * @uiLabel - ${this._("w_Buildings_BuildingName")}
                     */
                    name: string;
                };

                /**
                 * @uiLabel - ${this._("w_Floor_FloorName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Floor_Floor")}
                 */
                floor: number;
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Buildings_BuildingName")}
                 * @uiType - iv-form-label
                 */
                buildingName?: string;

                /**
                 * @uiLabel - ${this._("w_Floor_FloorName")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /**
                 * @uiLabel - ${this._("w_Floor_Floor")}
                 * @uiType - iv-form-label
                 */
                floor?: number;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
