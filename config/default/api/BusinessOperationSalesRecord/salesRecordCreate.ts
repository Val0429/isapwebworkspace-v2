import { IBusinessOperationSalesRecord, IResponse } from '@/config/default/api/interfaces';

declare namespace SalesRecordCreate {
    export interface Input {
        datas: IBusinessOperationSalesRecord[];
    }

    export interface Output extends IResponse {}
}

export default SalesRecordCreate;
