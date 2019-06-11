<template>
    <transition
        name="modal"
        v-if="visible"
    >
        <div
            class="modal-mask"
            ref="mask"
        >
            <div class="modal-wrapper">
                <iv-card
                    class="modal-container"
                    :label="label"
                    :data="data"
                >
                    <template #toolbox>
                        <slot name="toolbox" />
                        <iv-toolbox-x
                            size="md"
                            @click="doUpdateVisible(false)"
                        />
                    </template>

                    <template name="default">
                        <VuePerfectScrollbar
                            class="scroll-area"
                            :settings="psSettings"
                        >
                            <iv-v-node
                                @mounted="doMounted"
                                ref="node"
                                :node="$slots.default || $scopedSlots.default"
                            />
                        </VuePerfectScrollbar>
                    </template>

                    <template #footer>
                        <slot name="footer"></slot>
                    </template>
                </iv-card>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" src="./modal.vue.ts" />

<style lang="scss" scoped>
$animation-duration: 0.2s;

* /deep/ .ps__scrollbar-y-rail {
    width: 10px !important;

    .ps__scrollbar-y {
        width: 6px !important;
    }
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.modal-container {
    display: inline-flex !important;
    margin: 0 auto;
    min-width: 350px;
    max-width: 80vw;
    max-height: 80vh;
    text-align: left;
}

.scroll-area {
    position: relative;
    max-height: calc(80vh - 200px);
    padding: 0 15px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    transition: $animation-duration;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>