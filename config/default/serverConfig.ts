var config: Config = {
    // Min server
    ip: '172.16.10.21',

    // Tina server
    // ip: '172.16.10.136',

    port: 6066,
    ssl: false,

    serverFrameworkVersionGreaterThan: '1.06.00',
};
export default config;

export interface Config {
    ip: string;
    port: number;
    ssl?: boolean;

    /// only allow server framework > THIS to do login
    serverFrameworkVersionGreaterThan: string;
}
