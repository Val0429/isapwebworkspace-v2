<template>
     <div key="main">
        <DoorForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import DoorForm from './DoorForm.vue';
@Component({
    components: { DoorForm }
})
export default class Door extends Vue {
    
    
}
</script>
