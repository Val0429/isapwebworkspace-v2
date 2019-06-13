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
            :server="{ path: '/acs/member' }"
            />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Member extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
