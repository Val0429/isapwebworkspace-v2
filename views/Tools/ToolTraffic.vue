<template>
    <div class="animated fadeIn">
        <iv-card
            :visible="!visible"
            label="search card"
        >

            <template #footer>
                <b-button
                    class="submit"
                    size="lg"
                    @click="visible = !visible"
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

        <iv-card
            :visible="visible"
            label="table card"
        >
        </iv-card>

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
export default class ToolTraffic extends Vue {
    // 收合card控制
    visible: boolean = false;

    created() {}

    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>




