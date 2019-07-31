<template>
     <div key="main">
        <FloorGroupForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

import FloorGroupForm from './FloorGroupForm.vue';

@Component({
    components: { FloorGroupForm }
})
export default class FloorGroup extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
