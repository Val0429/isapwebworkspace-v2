<template>
    <div key="main">
        <ivc-account-list-form key="AccountForm" />
    </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Custom
import { EUserRole } from "@/services/Role";

// Service
import Dialog from "@/services/Dialog";
import RoleService from "@/services/Role/RoleService";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

@Component
export default class SetupsAccount extends Vue {}
</script>