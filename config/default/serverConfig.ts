/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';
import FlowService from '@/services/FlowService';

var config: Config = {
    // Min
    // ip: '172.16.10.21',

    // Val
    ip: '172.16.10.122',

    // QA Tina
    // ip: '172.16.10.175',

    port: 6060,
    ssl: false,
    prodPort: 6060,
    serverFrameworkVersionGreaterThan: '1.06.00',
    hideDefaultServerErrorModal: true,
};

export default config;
