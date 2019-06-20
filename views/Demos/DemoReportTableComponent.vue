<template>
    <div>
        DemoReportComponent
        <anlysis-dashboard :anlysisData="data">
        </anlysis-dashboard>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class DemoReportComponent extends Vue {
    data = {};

    created() {}

    mounted() {}
}
</script>
