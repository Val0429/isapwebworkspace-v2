<template>
     <div key="main">
        <UserPermissionForm />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import UserPermissionForm from './UserPermissionForm.vue';

@Component({
    components: { UserPermissionForm }
})
export default class UserPermission extends Vue {
    
}
</script>
