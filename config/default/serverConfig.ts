/*
 * Created on Tue Jul 30 2019
 * Author: Val Liu
 * Copyright (c) 2019, iSAP Solution
 */

import { Config } from '@/../config/default/serverConfig';
import PackageJSON from '@/package.json';

var config: Config = {
    ip: 'localhost',
    port: 6060,
    ssl: false,
    prodPort: 6060,
    serverFrameworkVersionGreaterThan: '1.06.00',
    hideDefaultServerErrorModal: true,
};

switch (PackageJSON.flow) {
    case '/flow1':
        config.ip = '172.16.10.122';
        config.port = 6060;
        break;
    case '/flow2':
        config.ip = '172.16.10.122';
        config.port = 6060;
        break;
}
export default config;
