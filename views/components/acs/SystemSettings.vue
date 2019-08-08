<template>
     <div key="main">
         <iv-auto-card :label="_('w_SmtpConfig')">
                <iv-form
                    :interface="smptpConfigInf()"                    
                    :value="smtpConfig"
                    @mounted="doMounted"                    
                    @submit="submitConfig({smtp:$event})"
                >
                </iv-form>
         </iv-auto-card>
            <iv-auto-card :label="_('w_CcureConfig')">
                <iv-form
                    :interface="ccureConfigInf()"                    
                    :value="ccureConfig"
                    @mounted="doMounted"                    
                    @submit="submitConfig({ccureconnect:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('w_CcureDbConfig')">
                <iv-form
                    :interface="ccureSqlServerConfigInf()"                    
                    :value="ccureSqlServerConfig"
                    @mounted="doMounted"                    
                    @submit="submitConfig({ccuresqlserver:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('w_SipassConfig')">
                <iv-form
                    :interface="sipassConfigInf()"                    
                    :value="sipassConfig"
                    @mounted="doMounted"                    
                    @submit="submitConfig({sipassconnect:$event})"
                >
                </iv-form>
         </iv-auto-card>
         <iv-auto-card :label="_('w_SipassDbConfig')">
                <iv-form
                    :interface="sipassDbConfigInf()"                    
                    :value="sipassDbConfig"
                    @mounted="doMounted"                    
                    @submit="submitConfig({sipassdb:$event})"
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
    private isMounted: boolean = false;
    allConfig:any={};
    ccureConfig: any={};
    smtpConfig:any={};
    ccureSqlServerConfig:any={};
    sipassConfig:any={};
    sipassDbConfig:any={};
    private async doMounted() {
        if(this.isMounted)return;
        await this.getConfigs();
        this.isMounted = true;
    }
  private async getConfigs() {
    this.allConfig=await this.$server.R("/config" as any,{});
    console.log("allconfig",this.allConfig);
    this.smtpConfig=Object.assign({},this.allConfig.smtp);
    this.ccureConfig=Object.assign({},this.allConfig.ccureconnect);
    this.ccureSqlServerConfig=Object.assign({},this.allConfig.ccuresqlserver);
    this.sipassConfig=Object.assign({},this.allConfig.sipassconnect);
    this.sipassDbConfig=Object.assign({},this.allConfig.sipassdb);
  }

    async submitConfig($event){
        console.log("submitConfig", $event);
        await this.$server.C("/config" as any, {data: $event});
        await this.getConfigs();
    }
    ccureConfigInf(){
        return `
            interface {
            server: string;
                port: number;
                user: string;
                password: string;
                database: string;
                connectionTimeout?: number;
                requestTimeout?: number;                
            }
        `;
    }
    sipassDbConfigInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                password: string;
                database: string;
                connectionTimeout: number;
            }
        `;
    }
    sipassConfigInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                password: string;
                uniqueId: string;
            }
        `;
    }
    ccureSqlServerConfigInf(){
        return `
            interface {
                server: string;
                port: number;
                user: string;
                password: string;
                database: string;
                connectionTimeout?: number;
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
                password: string;
            }
        `;
    }
}
</script>
