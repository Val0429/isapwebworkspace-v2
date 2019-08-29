/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';

var config: Config = {
    // 皓全
    ip: '172.16.10.155',

    // Min server
    // ip: '172.16.10.21',

    // Rebaca server
    // ip: '172.16.10.194',

    // Tina server
    // ip: '172.16.10.136',

    port: 6066,
    ssl: false,

    serverFrameworkVersionGreaterThan: '1.06.00',

    hideDefaultServerErrorModal: true,
};
export default config;
