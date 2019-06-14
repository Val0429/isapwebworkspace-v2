<template>
     <div key="main">
        <MemberForm />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import MemberForm from './MemberForm.vue';

@Component({
    components: { MemberForm }
})
export default class Member extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
