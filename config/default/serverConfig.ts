/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';

var config: Config = {
    // Min server
    ip: '172.16.10.122',

    // Rebaca server
    // ip: '172.16.10.194',

    // Tina server
    // ip: '172.16.10.136',

    port: 6060,
    ssl: false,

    serverFrameworkVersionGreaterThan: '1.06.00',

    hideDefaultServerErrorModal: false,
};
export default config;
