<template>
     <div key="main">
        <ReaderForm />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import ReaderForm from './ReaderForm.vue';

@Component({
    components: { ReaderForm }
})
export default class Reader extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
