<template>
     <div key="main">
        
           <ElevatorForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import ElevatorForm from "./ElevatorForm.vue";

@Component({
    components: { ElevatorForm }
})
export default class Elevator extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
