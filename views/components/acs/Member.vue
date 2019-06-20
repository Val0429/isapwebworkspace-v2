<template>
     <div key="main">
        <MemberForm />
        <MemberForm1 />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import MemberForm from './MemberForm.vue';
import MemberForm1 from './MemberForm1.vue';

@Component({
    components: { MemberForm1 }
})
export default class Member extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
