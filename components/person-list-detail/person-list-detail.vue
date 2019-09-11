<template>
    <iv-auto-card
        ref="card"
        :label="_('m_Persons_Person_Detail')"
        >
        <iv-table
            :interface="basicData()"
            >
        </iv-table>
    </iv-auto-card>
</template>

<script lang="ts" src="./person-list-detail.vue.ts" />