var config: Config = {
    // Tui
    // ip: '172.16.10.21',

    //  ip: '172.16.10.178',

    // localhost
    ip: 'localhost',
    prodPort:6060,
    port: 6060,
    ssl: false,
    hideDefaultServerErrorModal:true,
    serverFrameworkVersionGreaterThan: '1.06.00',
};
export default config;

export interface Config {
    ip: string;
    port: number;
    ssl?: boolean;
    prodPort?:number,
    /// only allow server framework > THIS to do login
    serverFrameworkVersionGreaterThan: string;
    /// hide server error popup?
    hideDefaultServerErrorModal?: boolean;
}
