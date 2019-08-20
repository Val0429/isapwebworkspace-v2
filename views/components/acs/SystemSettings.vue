<template>
     <div key="main">
         <b-table 
                v-show="currentConfig=='none'"
                striped hover 
                ref="table"
                :items="sysSettings" 
                :fields="fields"                 
           >
            <!-- A virtual column -->
                    <template slot="index" slot-scope="data">
                        {{ data.index+1}}
                    </template>
                    <template slot="Actions" slot-scope="data">                        
                        <iv-toolbox-edit @click="editConfig(data)" />                        
                    </template>
           </b-table>
         <iv-auto-card :label="_('smtp')" v-show="currentConfig=='smtp'">
                <template #footer-before>
                    <b-button size="lg" variant="secondary" @click="currentConfig='none'">{{ _("wb_Back") }}</b-button>
                </template>
                <iv-form
                    :interface="smptpConfigInf()"                    
                    :value="smtp"
                                      
                    @submit="submitConfig({smtp:$event})"
                >
                </iv-form>
         </iv-auto-card>
            <iv-auto-card :label="_('ccureconnect')" v-show="currentConfig=='ccureconnect'">
                <template #footer-before>
                    <b-button size="lg" variant="secondary" @click="currentConfig='none'">{{ _("wb_Back") }}</b-button>
                </template>
                <iv-form
                    :interface="ccureconnectInf()"                    
                    :value="ccureconnect"
                                      
                    @submit="submitConfig({ccureconnect:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('sipassconnect')" v-show="currentConfig=='sipassconnect'">
                <template #footer-before>
                    <b-button size="lg" variant="secondary" @click="currentConfig='none'">{{ _("wb_Back") }}</b-button>
                </template>
                <iv-form
                    :interface="sipassconnectInf()"                    
                    :value="sipassconnect"
                                      
                    @submit="submitConfig({sipassconnect:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('sipassdb')" v-show="currentConfig=='sipassdb'">
                <template #footer-before>
                    <b-button size="lg" variant="secondary" @click="currentConfig='none'">{{ _("wb_Back") }}</b-button>
                </template>
                <iv-form
                    :interface="sipassdbInf()"                    
                    :value="sipassdb"
                                      
                    @submit="submitConfig({sipassdb:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('humanresource')" v-show="currentConfig=='humanresource'">
                <template #footer-before>
                    <b-button size="lg" variant="secondary" @click="currentConfig='none'">{{ _("wb_Back") }}</b-button>
                </template>
                <iv-form
                    :interface="humanresourceInf()"                    
                    :value="humanresource"
                                      
                    @submit="submitConfig({humanresource:$event})"
                >
                </iv-form>
         </iv-auto-card>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import SyncReceiverForm from './SyncReceiverForm.vue';

@Component({
    components: { }
})
export default class SyncReceiver extends Vue {
    currentConfig="none";
    allConfig:any={};
    ccureconnect: any={};
    smtp:any={};
    sipassconnect:any={};
    sipassdb:any={};
    humanresource:any={};
    sysSettings:any[]=[];
    fields=[];
  private async getConfigs() {
    this.allConfig=await this.$server.R("/config" as any,{});
    console.log("allconfig",this.allConfig);
    this.smtp=Object.assign({},this.allConfig.smtp);
    this.ccureconnect=Object.assign({},this.allConfig.ccureconnect);
    this.sipassconnect=Object.assign({},this.allConfig.sipassconnect);
    this.sipassdb=Object.assign({},this.allConfig.sipassdb);
    this.humanresource=Object.assign({},this.allConfig.humanresource);
    this.sysSettings=[];
    this.sysSettings.push({name:"smtp", label:this._("smtp"), config:this.smtp});
    this.sysSettings.push({name:"ccureconnect", label:this._("ccureconnect"), config:this.ccureconnect});
    this.sysSettings.push({name:"sipassconnect", label:this._("sipassconnect"), config:this.sipassconnect});
    this.sysSettings.push({name:"sipassdb", label:this._("sipassdb"), config:this.sipassdb});
    this.sysSettings.push({name:"humanresource", label:this._("humanresource"), config:this.humanresource});
  }
    
    async created(){
      this.fields = [
            {
                key: "index",
                label: this._('w_Number')
            },
            {
                key: "label",
                label: this._('w_Name')
            },
            {
                key: "Actions",
                label: this._('w_Action')
            }

        ];
        await this.getConfigs();
}
    async submitConfig($event){
        console.log("submitConfig", $event);
        await this.$server.C("/config" as any, {data: $event});
        this.currentConfig="none";
        await this.getConfigs();
    }
    editConfig(data){
        console.log("editConfig", data);
        this.currentConfig=data.item.name;
    }
    ccureconnectInf(){
        return `
            interface {
            server: string;
                port: number;
                user: string;
                /***
                *@uiType - iv-form-password
                */
                password: string;
                database: string;
                connectionTimeout?: number;
                mdbpath?: string; 
                mdbpath2?: string; 
            }
        `;
    }
    sipassdbInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                /***
                *@uiType - iv-form-password
                */
                password: string;
                database: string;
                connectionTimeout: number;
            }
        `;
    }
    sipassconnectInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                /***
                *@uiType - iv-form-password
                */
                password: string;
                uniqueId: string;
            }
        `;
    }
    smptpConfigInf(){
        return `
            interface {
                enable: boolean;
                bufferCount?: number;
                host: string;
                port: number;
                email: string;
                /***
                *@uiType - iv-form-password
                */
                password: string;
            }
        `;
    }
    humanresourceInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                /***
                *@uiType - iv-form-password
                */
                password: string;
                database: string;
                connectionTimeout?: number;
            }
        `;
    }
}
</script>
