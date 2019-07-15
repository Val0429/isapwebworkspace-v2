<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
             <b-row>
                <b-col> 
                    {{_("w_Site")}} 
                <b-form-select
                    @change="updateArea()"
                    v-model="siteObjectId"
                >
                <option />
                <option
                    v-for="option in sites"  
                    :key="option.key"
                    :value="option.key"               
                    >
                    {{ option.value }}
                </option>
                </b-form-select> 
                </b-col>
                <b-col>  
                    {{_("w_Area")}} 
                <b-form-select
                @change="update()"
                v-model="areaObjectId"
            >
                <option />
                <option 
                    v-for="option in areas"  
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

<script lang="ts" src="./site-area.vue.ts" />

<style lang="scss">

</style>

