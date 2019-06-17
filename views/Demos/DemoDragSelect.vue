<template>
    <div class="animated fadeIn">
        <iv-card>
            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="back"
                >{{ _('w_Back') }}
                </b-button>
                <b-button
                    variant="primary"
                    size="lg"
                    @click="submit"
                >{{ _('w_Submit') }}
                </b-button>
                <b-button
                    variant="default"
                    size="lg"
                    @click="reset"
                >{{ _('w_Reset') }}
                </b-button>
            </template>
        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

@Component({
    components: {}
})
export default class DemoDragSelect extends Vue {
    created() {}
    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>
