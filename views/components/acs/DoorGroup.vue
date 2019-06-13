<template>
     <div key="main">
        
            <!-- interface="
            interface {
                objectId:string;
                createdAt:Date;
                updatedAt:Date;
            }
            " -->

        <DoorGroupForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

import DoorGroupForm from './DoorGroupForm.vue';

@Component({
    components: { DoorGroupForm }
})
export default class DoorGroup extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
