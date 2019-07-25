<template>
    <div>
    <p><iv-language-button /></p>

    <iv-auto-card>
        <iv-step-progress @submit="log">
            <template #1>
                <pre>
                    Purpose
                    Introduction
                </pre>
                <iv-form
                    interface="
                    interface {
                        enable: boolean;
                    }
                    "
                    />
            </template>

            <template #2>
                <iv-form
                    interface="
                    interface {
                        account: string;
                        password: string;
                    }
                    "
                    />
            </template>
        </iv-step-progress>
    </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Form2 extends Vue {
    private isMounted: boolean = false;
    mounted() {
        this.isMounted = true;
    }

    private log() {
        console.log(...arguments);
    }

}
</script>
