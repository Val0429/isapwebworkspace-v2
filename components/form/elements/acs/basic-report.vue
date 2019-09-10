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
                <b-button :disabled="selectedColumns.length==0 || isBusy" class="btn-filter" size="lg" v-bind="$refs.filter.submitBindings.$attrs" v-on="$refs.filter.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                <b-button :disabled="isBusy" class="btn-filter" size="lg" v-bind="$refs.filter.resetBindings.$attrs" v-on="$refs.filter.resetBindings.$listeners" @click="onReset()">{{ _("wb_Reset") }}</b-button>                
            </div>
        </template>
        </iv-card>
        
        <iv-card            
            :label="title"
            v-if="showTable"
            >
            <template #toolbox>
                <iv-toolbox-export @click="exportToExcel()"/>
                
            </template>        
            <b-table striped hover
                ref="reportTable"
                :items="itemsProvider" 
                :fields="sortedFields"
                :per-page="perPage"
                :current-page="currentPage">
                <!-- A virtual column -->
                <template slot="index" slot-scope="data">
                    {{ data.index + (currentPage-1)*perPage+ 1 }}
                </template>
                   
                </b-table>
                <b-pagination
                v-model="currentPage"
                :total-rows="total"
                :per-page="perPage"
                aria-controls="my-table"
                />           
           
        </iv-card> 
 
    </div>
</template>

<script lang="ts" src="./basic-report.vue.ts" />

<style lang="scss" scoped>

</style>