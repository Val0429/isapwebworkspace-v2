<template>
     <div key="main">
        <ElevatorGroupForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

import ElevatorGroupForm from './ElevatorGroupForm.vue';

@Component({
    components: { ElevatorGroupForm }
})
export default class ElevatorGroup extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
