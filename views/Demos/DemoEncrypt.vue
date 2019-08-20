<template>
    <div class="animated fadeIn">
        <span>{{ encryptString }}</span>
    </div>
</template>


<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Encrypt from "@/services/Encrypt";

@Component({
    components: {}
})
export default class DemoEncrypt extends Vue {
    encryptString: string = "";

    created() {
        this.encryptTimestamp();
    }

    mounted() {}

    encryptTimestamp() {
        this.encryptString = Encrypt.sha256Timestamp();
    }
}
</script>