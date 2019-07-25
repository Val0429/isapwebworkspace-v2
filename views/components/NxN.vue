<template>
    <iv-route-transition>
        <div key="main" style="padding: 10px">
            <p><iv-language-button /></p>

            <iv-card label="Face List">
                <template #toolbox>
                    <iv-toolbox-view @click="toggleView" />
                    <iv-toolbox-divider />
                </template>

                <iv-form
                    ref="form"
                    interface="
                    interface {
                        start: Date;
                        end: Date;
                    }
                    "
                    :value="value"
                    @mounted="doMounted"
                    @submit="doQuery($event)"
                    />
                <template v-if="isMounted">
                    <b-button size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners">{{ _("wb_Submit") }}</b-button>
                    <b-button size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners">{{ _("wb_Reset") }}</b-button>
                </template>


                <div :key="index" v-for="(value, index) of cacheResult" style="clear: both; margin-top: 20px">
                    <div class="time-title">{{ getTimeString(value.startperiod) }}</div>
                    
                    <div
                        :class="{ imgborder: true, selected: selected.indexOf(val2.source.fid) >= 0 }" :key="index2" v-for="(val2, index2) of value.data" style="float:left"
                        >
                        <img class="thumbnail" :src="val2.url" @click="doToggle(val2.source.fid)"
                            v-b-tooltip.hover :title="`time: ${getTimeString(val2.timestamp, true)}\r\nfid: ${val2.source.fid}\r\nfrs: ${val2.source.frsId}\r\nchannel: ${val2.source.channel}`"
                            />
                    </div>
                </div>

                <BR style="clear: both" />
            </iv-card>

        </div>
    </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import { SmartCommunityServer } from '@/config/default/server';

interface ISource {
    fid: string;
    frsId: string;
    channel: string;
    snapshot: string;
}

interface IOutputSearchData {
    source: ISource;
    url: string;
    timestamp: Date;
}

interface IOutputSearchUnit {
    startperiod: Date;
    data: IOutputSearchData[];
}
type IOutputSearch = IOutputSearchUnit[];

@Component
export default class NxN extends Vue {
    private result: IOutputSearch = null;
    private selected: string[] = [];
    private filter: boolean = false;
    private value: any = { start: null, end: null };

    private get cacheResult() {
        if (!this.result) return;
        if (!this.filter) return this.result;
        let result = this.result.reduce( (final, data) => {
            let d2 = { ...data };
            d2.data = data.data.reduce( (final, search) => {
                if (this.selected.indexOf(search.source.fid) < 0) return final;
                final.push(search);
                return final;
            }, []);
            if (d2.data.length === 0) return final;
            final.push(d2);
            return final;
        }, []);
        return result;
    }

    private async doQuery(value?) {
        this.value.start = value.start;
        this.value.end = value.end;
        let result = await this.server.R("/search" as any, {
            start: value.start.valueOf(),
            end: value.end.valueOf()
        });
        for (let o of result as any) {
            o.startperiod = new Date(o.startperiod);
            for (let c of o.data) {
                c.timestamp = new Date(c.timestamp);
            }
        }
        this.result = result as any;
    }

    private isMounted: boolean = false;
    private server;
    private async doMounted() {
        this.isMounted = true;
        this.server = new SmartCommunityServer({
            ip: "172.16.10.81",
            //ip: "localhost",
            port: 6060,
            ssl: false
        });
        await this.server.C("/users/login", {
            username: "Admin",
            password: "123456"
        });
        let now = new Date();
        let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()-1, 0, 0);
        this.doQuery({ start, end: now });
    }
    private doToggle(fid: string) {
        let idx = this.selected.indexOf(fid);
        if (idx >= 0) this.selected.splice(idx, 1);
        else {
            this.selected.push(fid);
        }
    }
    private toggleView() {
        this.filter = !this.filter;
    }
    private padZero(value: any, num: number): string {
        value = value + "";
        return new Array(num - value.length).fill(0).join("") + value;
    }
    private getTimeString(value: Date, seconds: boolean = false) {
        return `${this.padZero(value.getHours(), 2)}:${this.padZero(value.getMinutes(), 2)}${seconds ? `:${this.padZero(value.getSeconds(), 2)}` : ''}`;
    }
    private log() {
        console.log(...arguments);
    }
}
</script>


<style lang="scss" scoped>
.time-title {
    font-weight: bold;
    font-size: 16px;
}
.thumbnail {
    max-width: 60px;
    max-height: 60px;
}
.imgborder {
    cursor: pointer;
    border: 2px solid transparent;
}
.selected {
    border: 2px solid red;
}
</style>