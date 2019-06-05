<template>
  <iv-route-transition>

    <div class="about" key="primary">
        <h1>This is an about page 3</h1>
        <iv-language-button />

        <iv-isap-auto-card label="123">
                    <iv-form
                        interface="
                        interface {
                            account: string;
                            password: string;
                        }
                        "
                        />
        </iv-isap-auto-card>

        <TestTree groupBy="" />

        <PreviewNVR />

        <FormQuick />

        <b-button @click="isAlert = true">trigger</b-button>

        <iv-modal
            :visible.sync="isAlert"
            label="Title"
        >

            <iv-step-progress>
                <template #1>
                    <iv-form
                        interface="
                        interface {
                            account: string;
                        }
                        "
                        />
                </template>
                <template #1-title>
                    Haha
                </template>
                <template #2>
                    <iv-form
                        interface="
                        interface {
                            account: string;
                        }
                        "
                        />
                </template>
                <template #2-title>
                    Haha
                </template>
                <template #3>
                    <iv-form
                        interface="
                        interface {
                            account: string;
                        }
                        "
                        />
                </template>
            </iv-step-progress>

        </iv-modal>

        <iv-card>
            <template #toolbox>
                <iv-toolbox-add />
            </template>
            <template #footer>
                <b-button>123</b-button>
            </template>
        </iv-card>

        <iv-card>
            <iv-step-progress>
                <template #1>
                    <iv-form
                        interface="
                        interface {
                            account: string;
                        }
                        "
                        />
                </template>
                <template #1-title>
                    Haha
                </template>
                <template #2>
                    <iv-form
                        interface="
                        interface {
                            account: string;
                        }
                        "
                        />
                </template>
                <template #2-title>
                    Haha
                </template>
            </iv-step-progress>
        </iv-card>

        <iv-toolbox-add />
        <iv-toolbox-delete />
        <iv-toolbox-divider />
        <iv-toolbox-edit />
        <iv-toolbox-export />
        <iv-toolbox-info />
        <iv-toolbox-more />
        <iv-toolbox-view />

        <iv-region-tree
            :server="{server, path: '/test/region'}"
            @valclick="log"
            >
            <template #title>
                123
            </template>
        </iv-region-tree>

        <iv-form
            :interface="inf()"
        />
    </div>

  </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter, FindRouter } from '@/../core/router';
import SmartCommunityServer from "@/config/default/server";
import { toEnumInterface } from '@/../core';
import PreviewNVR from './PreviewNVR.vue';
import FormQuick from './FormQuick.vue';
import TestTree from './TestTree.vue';

const server = SmartCommunityServer.getDefault();

RegisterRouter({ path: '/', name: "home", redirect: '/home/about/3' })();

RegisterRouter({ path: '/test', name: "_('wb_Submit')" })();

@RegisterRouter({ path: '/home/about/3', name: "Hello", icon: 'fa-quora', permission: '/test/me' })
@Component({
    components: { FormQuick, PreviewNVR, TestTree }
})
export default class About3 extends Vue {
    private server = server;

    inf() {
        return `
            interface {
                /*
                * @uiLabel - ${this._('wb_Back')}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                account: ${toEnumInterface({
                    '1': "1",
                    '2': "2"
                })}
            }
        `;
    }

    private isAlert: boolean = false;
    log() {
        console.log('log', ...arguments);
    }
}
</script>
