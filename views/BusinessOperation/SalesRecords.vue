<template>
    <div class="animated fadeIn">

        <iv-card
            :label="_('w_BOSalesRecords_CardTitle')"
        >

            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >
                <template #1-title>{{ _('w_ForgetPassword_Step1') }}</template>
                <template #1>
                    test 1
                </template>

                <template #2-title>{{ _('w_ForgetPassword_Step2') }}</template>
                <template #2>
                    test 2
                </template>

                <template #3-title>{{ _('w_ForgetPassword_Step3') }}</template>
                <template #3>
                    test 3
                </template>

            </iv-step-progress>

             <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="saveRestore"
                >{{ _('w_Leave') }}
                </b-button>
            </template>

        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog.vue";

enum EPageStep {
	list = "list",
	add = "add",
	edit = "edit",
	view = "view",
	none = "none",
}

@Component({
    components: {}
})
export default class SalesRecords extends Vue {

	ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;
    
    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

	created() {

	}

	mounted() {

	}

	clearInputData() {

	}

	saveRestore() {
		alert('saveRestore')
    }
    

}
</script>

