export class FlowService {
    private _flow = '/flow1';

    constructor() {
        let tempWindow: any = window;

        if (tempWindow.flow != undefined && typeof tempWindow.flow == 'string') {
            switch (tempWindow.flow) {
                case 'Flow1':
                    this._flow = '/flow1';
                    break;
                case 'Flow2':
                    this._flow = '/flow2';
                    break;
            }
        }
    }

    get flow(): string {
        return this._flow;
    }
}

export default new FlowService();
