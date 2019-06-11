<template>
    <div class="animated fadeIn">

	    <iv-card
		    :label=" _('w_Backup_List') "
	    >
		    <b-form-checkbox
			    v-for="option in options"
			    v-model="selected"
			    :key="option.value"
			    :value="option.value"
			    class="m-2"
		    >
			    {{ option.text }}
		    </b-form-checkbox>

		    <template #footer>
			    <b-button
				    variant="primary"
				    size="lg"
				    @click="saveBackup()"
			    >{{ _('w_Backup_Backup') }}
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
export default class Backup extends Vue {

	ePageStep = EPageStep;
	pageStep: EPageStep = EPageStep.list;

	selected: any = {};

	options: any = [
		{ text: 'User setting', value: 'UserSetting' },
		{ text: 'Sites setting', value: 'SitesSetting' },
		{ text: 'Business Operation', value: 'BusinessOperation' },
		{ text: 'Device setting', value: 'DeviceSetting' }
	];

	created() {

	}

	mounted() {

	}

	clearInputData() {

	}

	saveBackup() {
		alert('saveBackup')
	}
}
</script>

