var config: Config = {
    // Min server
    ip: '172.16.10.21',

    // Rebaca server
    // ip: '172.16.10.194',

    // Tina server
    // ip: '172.16.10.136',

    port: 6066,
    ssl: false,

    serverFrameworkVersionGreaterThan: '1.06.00',
};
export default config;

export interface Config {
    /// for debug only. normally client & server share different port
    /// if without specific ip / port / ssl, will use current browser url
    ip?: string;
    port?: number;
    ssl?: boolean;

    /// only allow server framework > THIS to do login
    serverFrameworkVersionGreaterThan: string;
}
