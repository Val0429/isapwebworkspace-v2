<template>
    <div>
        <b-modal
            v-model="modalShow"
            hide-header
            hide-footer
            size="lg"
        >
            <iv-card
                :visible="true"
                :label="_('w_ReportTemplate_RecipientSelect')"
            >
                <iv-form
                    :interface="IFilterConditionForm()"
                    @submit="doSubmit($event)"
                >

                    <template #userIds="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="userIds"
                        >
                        </iv-form-selection>
                    </template>

                </iv-form>

                <template #footer>
                    <b-button
                        class="info"
                        size="lg"
                        @click="doCancel"
                    >
                        {{ _('w_Cancel') }}
                    </b-button>

                    <b-button
                        class="submit"
                        size="lg"
                        @click="doSubmit"
                    >
                        {{ _('wb_Submit') }}
                    </b-button>

                    <b-button
                        class="reset"
                        size="lg"
                        @click="doReset"
                    >
                        {{ _('wb_Reset') }}
                    </b-button>
                </template>

            </iv-card>
        </b-modal>

    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class Recipient extends Vue {
    // Prop
    @Prop({
        type: Boolean, // Boolean, Number, String, Array, Object
        default: false
    })
    modalShow: boolean;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    userSelectItem: object;

    // userSelectItem: any = {};

    userIds: any = [];

    created() {}

    mounted() {
        // this.initSelectItemUsers();
    }

    @Watch("modalShow", { deep: true })
    private whenModalShowChanged(newVal, oldVal) {}

    async initSelectItemUsers() {
        let tempUserSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempUserSelectItem[
                            returnValue.objectId
                        ] = `${returnValue.username} - ${returnValue.email}`;
                    }
                    this.userSelectItem = tempUserSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    doSubmit() {
        // TODO: wait api
        this.$emit("user-data", this.userIds);
        this.doCancel();
    }

    doReset() {
        this.userIds = [];
    }

    doCancel() {
        this.userIds = [];
        this.$emit("return-modalShow", false);
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipients")}
                 */
                userIds: ${toEnumInterface(this.userSelectItem as any, true)};

            }
        `;
    }
}

export default Recipient;
Vue.component("recipient", Recipient);
</script>

<style lang="scss" scoped>
.submit {
    background-color: #5c7895;
    border: 1px solid #5c7895;
}
.reset {
    background-color: #d7d7d7;
    border: 1px solid #d7d7d7;
}
</style>
