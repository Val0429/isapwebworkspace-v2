<template>
     <div key="main">
        
            <!-- interface="
            interface {
                objectId:string;
                createdAt:Date;
                updatedAt:Date;
            }
            " -->

        <iv-table
            :server="{ path: '/acs/permissiontable' }"
            />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class PermissionTable extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
