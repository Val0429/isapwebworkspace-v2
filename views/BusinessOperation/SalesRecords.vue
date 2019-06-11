<template>
    <div class="animated fadeIn">
	    SalesRecords

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { IConfig, IAnalysis } from '@/config/default/api/interfaces';
import { toEnumInterface } from "../../../core";

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog.vue";

enum EPageStep {
	list,
	add,
	edit,
	none,
}


@Component({
    components: {}
})
export default class SalesRecords extends Vue {

	ePageStep = EPageStep;
	pageStep: EPageStep = EPageStep.list;

	created() {

	}

	mounted() {

	}

	clearInputData() {

	}

}
</script>

