<template>
    <iv-route-transition>
        <div key="main">
            <p>
                <iv-language-button />
            </p>
            <iv-card label="Simple Card">
                <template #toolbox>
                    <iv-toolbox-add />
                    <iv-toolbox-delete />
                    <iv-toolbox-edit />
                    <iv-toolbox-export />
                    <iv-toolbox-info />
                    <iv-toolbox-view />
                    <iv-toolbox-more>
                        <iv-toolbox-add />
                        <iv-toolbox-delete />
                        <iv-toolbox-edit />
                        <iv-toolbox-export />
                        <iv-toolbox-info />
                        <iv-toolbox-view />
                    </iv-toolbox-more>
                </template>

                You can put any contents inside here.

                <template #footer>
                    You can define any footer.
                </template>
            </iv-card>
        </div>
    </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Cards extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
