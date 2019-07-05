<template>
     <div key="main">
        <UserForm />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import UserForm from './UserForm.vue';

@Component({
    components: { UserForm }
})
export default class User extends Vue {
    
}
</script>
