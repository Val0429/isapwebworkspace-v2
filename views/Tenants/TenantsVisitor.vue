<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Tenants_VisitorList')"
            >

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :server="{ path: '/visitors' }"
                >

                    <template #visitor.status="{$attrs}">
                        <div>{{$attrs.row.cancelled ? "Cancelled" : $attrs.row.visitor.status}}</div>
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
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export default class TenantsVisitor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    ////////////////////////// interface //////////////////////////

    ITableList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                visitor: interface {
                    /**
                     * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                     */
                    phone: string;

                    /**
                     * @uiLabel - ${this._("w_Tenants_Name")}
                     */
                    name: string;

                    /**
                     * @uiLabel - ${this._("w_Tenants_Email")}
                     */
                    email: string;

                    /**
                     * @uiLabel - ${this._("w_Tenants_Status")}
                     */
                    status: string;

                };

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 */
                startDate: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 */
                endDate: any;

                purpose: interface {
                    /**
                     * @uiLabel - ${this._("w_Tenants_Purpose")}
                     */
                    name: string;
                };

                notify: interface {
                    visitor:  interface {
                    /**
                     * @uiLabel - ${this._("w_Tenants_Email")}
                     */
                    email: boolean;

                    /**
                     * @uiLabel - ${this._("w_Tenants_Phone")}
                     */
                    phone: boolean;
                    };
                };

                Actions: any;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




