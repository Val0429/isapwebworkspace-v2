import config from '@/config/default/serverConfig';

interface IDeveloperServer {
    host: string;
    httpPort: string;
    httpsPort: string;
}

export class ServerConfig {
    private developerServer: IDeveloperServer = {
        host: config.ip,
        httpPort: config.port.toString(),
        httpsPort: config.port.toString(),
    };
    private _protocol: string = location.protocol;
    private _host: string = window.location.hostname;
    private _port: string = window.location.port;
    private _url: string = '';

    constructor() {
        this.initServerConfig();
    }

    initServerConfig() {
        let productMode = process.env.NODE_ENV;
        if (productMode == 'production') {
            var tempPortString = '';
            if (this._protocol == 'http:' && this._port != '80') {
                tempPortString = ':' + this._port;
            }

            if (this._protocol == 'https:' && this._port != '443') {
                tempPortString = ':' + this._port;
            }

            this._url += this._protocol;
            this._url += '//';
            this._url += this._host;
            this._url += tempPortString;
            this._url += '/';
        } else {
            this._host = this.developerServer.host;
            this._port = this._protocol == 'https:' ? this.developerServer.httpsPort : this.developerServer.httpPort;
            var tempPortString = '';
            if (this._protocol == 'http:' && this._port != '80') {
                tempPortString = ':' + this._port;
            }

            if (this._protocol == 'https:' && this._port != '443') {
                tempPortString = ':' + this._port;
            }

            this._url += this._protocol;
            this._url += '//';
            this._url += this._host;
            this._url += tempPortString;
            this._url += '/';
        }
    }

    get protocol(): string {
        return this._protocol;
    }

    get host(): string {
        return this._host;
    }

    get port(): string {
        return this._port;
    }

    get url(): string {
        return this._url;
    }
}

export default new ServerConfig();
