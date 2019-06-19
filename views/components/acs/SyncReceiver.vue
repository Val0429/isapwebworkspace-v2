<template>
     <div key="main">
        <SyncReceiverForm />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import SyncReceiverForm from './SyncReceiverForm.vue';

@Component({
    components: { SyncReceiverForm }
})
export default class SyncReceiver extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
