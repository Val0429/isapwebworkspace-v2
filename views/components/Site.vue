<template>
    <div key="main">
        <iv-language-button />
        <ivc-site-form />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Components extends Vue {
    private async logout() {
        await this.$logout();
        this.$goHome();
    }
}
</script>
