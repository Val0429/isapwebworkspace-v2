<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
          

            <iv-sort-select  
                v-if="leftOptions.length>0"                      
                v-model="rightOptions"
                class="col-md-12"
                :options="leftOptions"
                v-on:input="updateSelected()"
            />

        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./multi-selections.vue.ts" />

<style lang="scss" scoped>

</style>

