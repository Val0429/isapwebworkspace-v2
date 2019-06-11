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

                                    <!-- language -->
                                    <!-- <div class="input-group mb-4">
                                        <iv-language-button class="mb-4" />
                                    </div> -->
                                    <!--== language ==-->

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
                                            <!-- language -->
                                            <iv-language-button />
                                            <!--== language ==-->

                                            <!-- forgot password -->
                                            <b-button
                                                variant="link"
                                                class="px-0"
                                            >
                                                {{ _('w_Login_ForgotPassword') }}
                                            </b-button>
                                            <!--== forgot password ==-->
                                        </b-col>
                                    </b-row>
                                </div>
                            </div>
                        </div>

                        <!-- Signup -->
                        <!-- <div
                            class="card text-white bg-primary py-5 d-md-down-none"
                            style="width:44%"
                        >
                            <div class="card-body text-center">
                                <div>
                                    <h2>{{ _('w_Login_SignUpTitle') }}</h2>
                                    <p>{{ _('w_Login_SignUpContent') }}</p>
                                    <b-button
                                        variant="primary"
                                        class="active mt-3"
                                    >{{ _('Register Now') }}!</b-button>
                                </div>
                            </div>
                        </div> -->
                        <!--== Signup ==-->

                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts" src="./login.vue.ts" />
