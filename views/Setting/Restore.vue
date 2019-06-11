<template>
    <div class="animated fadeIn">
	    <iv-card
		    :label="_('w_Restore_SettingFiles')"
	    >

			    <b-form-file
				    :label="_('w_Restore_SelectFile')"
				    :placeholder="_('w_Restore_SelectFile')"
				    :drop-placeholder="_('w_Restore_SelectFile')"
				    multiple="multiple"
			    />


		    <template #footer>
			    <b-button
				    variant="primary"
				    size="lg"
				    @click="saveRestore()"
			    >{{ _('w_Submit') }}
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
export default class Restore extends Vue {

	ePageStep = EPageStep;
	pageStep: EPageStep = EPageStep.list;

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

