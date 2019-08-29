<template>
    <div>
        <leaf-map
            style="height: 500px; width: 100%"
            :zoom="zoom"
            :center="center"
            :draggable="false"
            @update:zoom="zoomUpdated"
            @update:center="centerUpdated"
            @mouseenter="frezze"
            >
            <leaf-tile-layer :url="url" />
            <leaf-marker 
                :lat-lng="marker"
                />
        </leaf-map>
    </div>
</template>

<script lang="ts" src="./sites-map.vue.ts" />