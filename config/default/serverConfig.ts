var config: Config = {
    port: 6060,

    serverFrameworkVersionGreaterThan: "1.06.00"
}
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
