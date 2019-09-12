<template>
    <div key="main">
        <ivc-frs-list-form />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

@Component
export default class ClientHikvision extends Vue {}
</script>

