/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';

var config: Config = {
    ip: '172.16.10.156',
    port: 80,
    ssl: false,

    serverFrameworkVersionGreaterThan: '1.06.00',

    hideDefaultServerErrorModal: false,
};
export default config;
