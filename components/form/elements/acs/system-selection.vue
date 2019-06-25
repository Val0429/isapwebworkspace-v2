<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
             <b-row>
                <b-col>  
                <b-form-select
                    @change="update()"
                    v-model="system"
                >
                <option />
                <option
                    v-for="option in options"  
                    :key="option.key"
                    :value="option.key"               
                    >
                    {{ option.value }}
                </option>
                </b-form-select> 
                </b-col>                
                
             </b-row>
        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./system-selection.vue.ts" />

<style lang="scss">

</style>

