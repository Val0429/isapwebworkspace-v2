<template>

     <div key="main">
        
        <iv-card  v-show="visible"
            :label="_('w_Filter')"
        >
         <iv-form 
           
            ref="form"
            class="col-md-9"
            @mounted="doMounted"
            :interface="inf"            
            @submit="onSubmit($event)">
            
            </iv-form> 

            
        <template v-if="isMounted" >            
            <div class="float-right">
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onSubmit()">{{ _("wb_Reset") }}</b-button>                
            </div>
        </template>
        </iv-card>
 
    </div>
</template>

<script lang="ts" src="./filter-form.vue.ts" />

<style lang="scss" scoped>

</style>