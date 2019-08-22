<template>
    <div
        id="app"
        class="app flex-row align-items-center"
        @keyup.enter="Login"
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
                                            :placeholder="_('w_Username')"
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
                                            :placeholder="_('w_Password')"
                                        >
                                    </div>

                                    <div class="input-group mb-4">
                                        <b-form-checkbox
                                            v-model="remeberMe"
                                            name="checkbox-1"
                                            :value="eRemeberMe.rememberMe"
                                            :unchecked-value="eRemeberMe.noRemeberMe"
                                        >
                                            {{ _('w_RememberMe') }}
                                        </b-form-checkbox>
                                    </div>

                                    <b-row>
                                        <b-col cols="6">
                                            <b-button
                                                style="margin-top: 3px"
                                                variant="primary"
                                                class="px-4"
                                                @click="Login()"
                                            >{{ _("w_Login_Login") }}</b-button>
                                        </b-col>

                                        <b-col
                                            cols="6"
                                            class="text-right"
                                        >
                                            <!-- language -->
                                            <iv-language-button />
                                            <!--== language ==-->

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
