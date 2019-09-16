/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';

var config: Config = {
    // Min server
    ip: '172.16.10.21',

    // QA Tina server
    // ip: '172.16.10.175',

    // Rebaca server
    // ip: '172.16.10.194',

    // Tina server
    // ip: '172.16.10.136',

    // Val server
    // ip: '172.16.10.21',

    port: 6060,
    ssl: false,

    prodPort: 6060,
    serverFrameworkVersionGreaterThan: '1.06.00',
    hideDefaultServerErrorModal: true,
};
export default config;
