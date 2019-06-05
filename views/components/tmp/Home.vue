<template>
  <iv-route-transition>

    <div class="home" key="primary">
      {{ _("w_Password") }}
      <iv-language-button />
      <img alt="Vue logo" src="../assets/images/logo.png">
    </div>

  </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';

@RegisterRouter({ path: '/home', name: "_('w_Password')", icon: 'isap-icon-edit' })
@Component
export default class Home extends Vue {
}
</script>
