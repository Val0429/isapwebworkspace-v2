<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
         <div class="input-group">    
        <select
            @change="updateSelected($event)"            
            class="col-md-12"
        >
            <option />
            <option
                v-for="option in options"  
                v-bind:key="option.key"
                v-bind:value="option.key"
                v-bind:selected="selected == option.key"
                >
                {{ option.value }}
            </option>
        </select>
         </div>
        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./single-selection.vue.ts" />

<style lang="scss">
.select2-container--open {
    z-index: 10000;
}
</style>

