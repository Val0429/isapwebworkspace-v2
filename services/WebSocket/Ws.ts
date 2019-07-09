// import { Print } from './print';

export interface IWs {
    url: string;
    OnOpen: (e: Event) => Promise<void>;
    OnMessage: (e: MessageEvent) => Promise<void>;
    OnError: (e: Event) => Promise<void>;
    OnClose: (e: CloseEvent) => Promise<void>;
}

/**
 * WebSocket
 */
export class Ws {
    private _isConnect: boolean = false;

    private _isClose: boolean = true;

    private _url: string;
    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

    private _websocket: WebSocket | null = null;

    private async _OnOpen(e: Event): Promise<void> {}

    private async _OnMessage(e: MessageEvent): Promise<void> {}

    private async _OnError(e: Event): Promise<void> {}

    private async _OnClose(e: CloseEvent): Promise<void> {}

    public constructor(ws: IWs) {
        this._url = ws.url;
        this._OnOpen = ws.OnOpen;
        this._OnMessage = ws.OnMessage;
        this._OnError = ws.OnError;
        this._OnClose = ws.OnClose;
    }

    public Connect = (): void => {
        this._isConnect = false;
        this._isClose = false;

        (<null>this._websocket) = null;

        (<WebSocket>this._websocket) = new WebSocket(this._url);

        (<WebSocket>this._websocket).onopen = async (e: Event): Promise<void> => {
            this._isConnect = true;

            // Print.Message('Ws', `${this.url} is connect`, 'success');
            await this._OnOpen(e).catch((e) => {});
        };

        (<WebSocket>this._websocket).onmessage = async (e: MessageEvent): Promise<void> => {
            await this._OnMessage(e).catch((e) => {});
        };

        (<WebSocket>this._websocket).onerror = async (e: Event): Promise<void> => {
            await this._OnError(e).catch((e) => {});
        };

        (<WebSocket>this._websocket).onclose = async (e: CloseEvent): Promise<void> => {
            await this._OnClose(e).catch((e) => {});

            if (!this._isClose) {
                this.Connect();
            }
        };
    };

    public Close = (): void => {
        this._isClose = true;

        (<WebSocket>this._websocket).close();
        (<null>this._websocket) = null;

        // Print.Message('Ws', `${this.url} is close`, 'warning');
    };

    public Send = (send: string): void => {
        try {
            if (!this._isConnect) {
                throw 'Not connect.';
            }

            (<WebSocket>this._websocket).send(send);
        } catch (e) {
            throw e;
        }
    };
}
