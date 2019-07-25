<template>
    <iv-route-transition>
        <div key="main" style="padding: 10px">
            <p><iv-language-button /></p>

            <iv-card>
                <iv-form
                    ref="form"
                    interface="
                    interface {
                        /**
                         * @uiType - iv-form-file
                         * @uiAttrs - { multiple: true }
                         */
                        files: any;
                    }
                    "
                    @mounted="doMounted"
                    @submit="doQuery"
                    />
                <template v-if="isMounted">
                    <b-button size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners">{{ _("wb_Submit") }}</b-button>
                    <b-button size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners">{{ _("wb_Reset") }}</b-button>
                </template>

                <BR />
                <div :key="index" v-for="(img, index) of result" style="position: relative; display: inline-table; float: left; width: 300px; height: 300px; border: 1px solid purple">
                    <img
                        v-b-tooltip.hover :title="`laplacian score: ${img.laplacianScore.toFixed(3)}\r\nshadow score: ${img.shadowScore.toFixed(3)}\r\nwidth adjustment: ${img.widthAdjustment.toFixed(3)}\r\nno face: ${img.faceNotFound}`"
                        style="display: block; max-width: 280px; max-height: 220px; margin-top: 10px; margin-left: auto; margin-right: auto" :src="img.url"
                        />
                    <div style="position: absolute; bottom: 35px; left: 0; right: 0; font-size: 14px; font-family: 微軟正黑體; text-align: center">
                        {{ getTitle(img) }}
                    </div>
                    <div
                        style="position: absolute; bottom: 10px; left: 40%; font-size: 18px; font-family: 微軟正黑體">{{ Math.round(img.score * 10000) / 100 }} 分</div>
                </div>

            </iv-card>
        </div>
    </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';
import { SmartCommunityServer } from '@/config/default/server';

interface IOutputSearchUnit {
    url: string;
    laplacianScore: number;
    shadowScore: number;
    widthAdjustment: number;
    score: number;
    faceNotFound: boolean;
}
type IOutputSearch = IOutputSearchUnit[];

async function getBase64(file: File): Promise<any> {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            resolve(reader.result);
        };
    });
}

@Component
export default class FaceScore extends Vue {
    private result: IOutputSearch = null;
    // private selected: string[] = [];
    // private filter: boolean = false;
    // private value: any = { start: null, end: null };

    // private get cacheResult() {
    //     if (!this.result) return;
    //     if (!this.filter) return this.result;
    //     let result = this.result.reduce( (final, data) => {
    //         let d2 = { ...data };
    //         d2.data = data.data.reduce( (final, search) => {
    //             if (this.selected.indexOf(search.source.fid) < 0) return final;
    //             final.push(search);
    //             return final;
    //         }, []);
    //         if (d2.data.length === 0) return final;
    //         final.push(d2);
    //         return final;
    //     }, []);
    //     return result;
    // }

    private async doQuery(value?) {
        let files = [];
        for (let i=0; i<value.files.length; ++i) {
            let result = await getBase64(value.files[i]);
            files.push(result);
        }

        let result = await this.server.C("/search" as any, {
            files
        });
        this.result = result as any;
    }

    private isMounted: boolean = false;
    private server;
    private async doMounted() {
        this.isMounted = true;
        this.server = new SmartCommunityServer({
            // ip: "172.16.10.81",
            ip: "localhost",
            port: 6060,
            ssl: false
        });
        let user = await this.server.C("/users/login", {
            username: "Admin",
            password: "123456"
        });

    }
    // private doToggle(fid: string) {
    //     let idx = this.selected.indexOf(fid);
    //     if (idx >= 0) this.selected.splice(idx, 1);
    //     else {
    //         this.selected.push(fid);
    //     }
    // }
    // private toggleView() {
    //     this.filter = !this.filter;
    // }
    // private padZero(value: any, num: number): string {
    //     value = value + "";
    //     return new Array(num - value.length).fill(0).join("") + value;
    // }
    // private getTimeString(value: Date, seconds: boolean = false) {
    //     return `${this.padZero(value.getHours(), 2)}:${this.padZero(value.getMinutes(), 2)}${seconds ? `:${this.padZero(value.getSeconds(), 2)}` : ''}`;
    // }
    private log() {
        console.log(...arguments);
    }
    private getTitle(face: IOutputSearchUnit) {
        let hint = [];
        if (face.laplacianScore <= 80) hint.push("模糊");
        if (face.shadowScore >= 180) hint.push("有陰影或光影");
        if (face.widthAdjustment >= 2) hint.push("檔案小");
        if (face.faceNotFound) hint.push("找不到人臉");
        return hint.join("，");
    }
}
</script>


<style lang="scss" scoped>
// .time-title {
//     font-weight: bold;
//     font-size: 16px;
// }
// .thumbnail {
//     max-width: 60px;
//     max-height: 60px;
// }
// .imgborder {
//     cursor: pointer;
//     border: 2px solid transparent;
// }
// .selected {
//     border: 2px solid red;
// }
</style>