var config: Config = {
    // Tui
    ip: '172.16.10.59',

    // localhost
    // ip: 'localhost',

    port: 6060,
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
