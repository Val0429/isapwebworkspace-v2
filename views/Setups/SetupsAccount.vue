<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_User_UserList')"
            >
                <template #toolbox>
                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />
                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/user/user' }"
                    @selected="selectedItem($event)"
                >
                    <template #email="{$attrs}">
                        {{ show30Words($attrs.value) }}
                    </template>

                    <template #sites="{$attrs}">
                        {{ showFirst($attrs.value) }}
                    </template>

                    <template #groups="{$attrs}">
                        {{ showFirst($attrs.value) }}
                    </template>

                    <template #Actions="{$attrs, $listeners}">

                        <iv-toolbox-more
                            size="sm"
                            :disabled="isSelected.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                            <iv-toolbox-resend-verification-code @click="resendVerificationCode" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <div
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
            >
                Empty 2
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

@Component({
    components: {}
})
export default class SetupsAccount extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    created() {}

    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>




