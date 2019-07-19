<template>
    <div>
        <b-button @click="showLoading">
            Show Loading
        </b-button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Loading from "@/services/Loading";

@Component({
    components: {}
})
export default class DeomLoading extends Vue {
    created() {}

    mounted() {}

    showLoading() {
        Loading.show();
        setTimeout(this.hideLoading, 3000);
    }

    hideLoading(){
        Loading.hide();
    }
}
</script>

<style lang="scss" scoped>

</style>