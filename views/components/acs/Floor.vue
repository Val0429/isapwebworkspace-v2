<template>
     <div key="main">
        <FloorForm/>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import FloorForm from './FloorForm.vue';
@Component({
    components: { FloorForm }
})
export default class Door extends Vue {
    
    
}
</script>
