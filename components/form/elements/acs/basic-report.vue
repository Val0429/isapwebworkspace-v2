<template>

     <div key="main">
        
        <iv-card            
            :label="_('w_Filter')"
        >
         <iv-form 
            ref="form"
            class="col-md-9"
            @mounted="doMounted"
            :interface="inf"
           
            @submit="onSubmit($event)">

            </iv-form> 

        <iv-sort-select
                v-if="options.length>0"                      
                v-model="selectedColumns"
                class="col-md-4"
                v-on:input="onOptionsChange($event)"
                :options="options"
            />
            
        <template v-if="isMounted" >            
            <div class="float-right">
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onSubmit()">{{ _("wb_Reset") }}</b-button>
                <b-button class="btn-filter" size="lg" @click="exportToExcel()" >{{ _("wb_Export") }}</b-button>            
                
            </div>
        </template>
        </iv-card>
        
        <iv-card            
            :label="title">        
        
           <b-table striped hover 
                :items="records" 
                :fields="sortedFields" 
                :per-page="perPage"
                :busy="isBusy"
                :current-page="currentPage"
           ></b-table>
           <b-pagination
            v-model="currentPage"
            :total-rows="records.length"
            :per-page="perPage"
            aria-controls="my-table"
            ></b-pagination>
           
        </iv-card> 
 
    </div>
</template>

<script lang="ts" src="./basic-report.vue.ts" />

<style lang="scss" scoped>
.btn-filter{
    margin: 0 5px;
}
</style>