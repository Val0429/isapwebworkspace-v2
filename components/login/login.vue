<template>
    <div
        id="app"
        class="app flex-row align-items-center"
    >
        <div class="container">
            <b-row class="justify-content-center">
                <b-col
                    xl="6"
                    md="8"
                >
                    <div class="card-group">
                        <div class="card p-4">
                            <div class="card">
                                <div class="card-body">
                                    <h1>{{ _('w_Login_LoginTitle') }}</h1>

                                    <p class="text-muted">{{ version }}</p>

                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="icon-user"></i>
                                            </span>
                                        </div>

                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="username"
                                            :placeholder="_('wb_Username')"
                                        >
                                    </div>

                                    <div class="input-group mb-4">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="icon-lock"></i>
                                            </span>
                                        </div>

                                        <input
                                            type="password"
                                            class="form-control"
                                            v-model="password"
                                            :placeholder="_('wb_Password')"
                                        >

                                    </div>

                                    <b-row>
                                        <b-col cols="6">
                                            <b-button
                                                style="margin-top: 3px"
                                                variant="primary"
                                                class="px-4"
                                                @click="Login()"
                                            >{{ _("wb_Login") }}</b-button>
                                        </b-col>

                                        <b-col
                                            cols="6"
                                            class="text-right"
                                        >

                                        </b-col>
                                    </b-row>
                                </div>
                            </div>
                        </div>

                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts" src="./login.vue.ts" />

<style lang="scss" scoped>
div.app {
    background-image: url(https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>
