<template>
     <div key="main">
        
           <PermissionTableForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import PermissionTableForm from './PermissionTableForm.vue'

@Component({
    components: { PermissionTableForm }
})
export default class PermissionTable extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
