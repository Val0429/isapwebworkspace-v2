<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Blacklist_List')"
            >
                <template #toolbox>
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/flow2/blacklist' }"
                    @selected="selectedItem($event)"
                >

                    <template #image="{$attrs, $listeners}">
                        <img
                            v-if="$attrs.row.image && $attrs.row.image != ''"
                            class="table-image"
                            :src="$attrs.row.image"
                        />
                    </template>

                </iv-table>
            </iv-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Loading from "@/services/Loading";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import RegexServices from "@/services/RegexServices";

@Component({
    components: {}
})
export default class Blacklist extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_Delete_ConfirmContent"),
            this._("w_Delete_ConfirmLabel"),
            () => {
                Loading.show();
                for (let detail of this.selectedDetail) {
                    let param = {
                        objectId: detail.objectId
                    };

                    param = RegexServices.trim(param);
                    this.$server
                        .D("/flow2/blacklist", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    this.pageToList();
                                }
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });
                }
            }
        );
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    ITableList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NickName")}
                 */
                nickname: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_UserName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Nric")}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 */
                image: any;

                 /**
                 * @uiLabel - ${this._("w_Blacklist_Remark")}
                 */
                remark: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.table-image {
    height: 100px;
}
</style>




