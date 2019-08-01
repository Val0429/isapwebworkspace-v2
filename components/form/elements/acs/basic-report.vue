<template>

     <div key="main">
        
        <iv-card            
            :label="_('w_Filter')"
        >
         <iv-form 
            ref="filter"            
            class="col-md-9"
            @mounted="doMounted"
            :interface="inf"            
            :value="value"        
            @update:*="onUpdate($event)"    
            @submit="onSubmit($event)">
            
            </iv-form> 

        <iv-sort-select
                ref="fieldSelection"
                v-if="options.length>0"                      
                v-model="selectedColumns"
                class="col-md-8"
                v-on:input="onOptionsChange($event)"
                :options="options"
            />
            
        <template v-if="isMounted" >            
            <div class="float-right">
                <b-button :disabled="selectedColumns.length==0" class="btn-filter" size="lg" v-bind="$refs.filter.submitBindings.$attrs" v-on="$refs.filter.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                <b-button class="btn-filter" size="lg" v-bind="$refs.filter.resetBindings.$attrs" v-on="$refs.filter.resetBindings.$listeners" @click="onReset()">{{ _("wb_Reset") }}</b-button>                
            </div>
        </template>
        </iv-card>
        
        <iv-card            
            :label="title"
            v-if="showTable">
            <template #toolbox>
                <iv-toolbox-export @click="exportToExcel()"/>
                
            </template>        
           <b-table 
                striped hover 
                ref="table"
                :items="processedRecords" 
                :fields="sortedFields" 
                :per-page="perPage"
                :busy="isBusy"
                :current-page="currentPage"
           ></b-table>
           <b-pagination
            v-model="currentPage"
            :total-rows="processedRecords.length"
            :per-page="perPage"
            aria-controls="my-table"
            ></b-pagination>
           
        </iv-card> 
 
    </div>
</template>

<script lang="ts" src="./basic-report.vue.ts" />

<style lang="scss" scoped>

</style>