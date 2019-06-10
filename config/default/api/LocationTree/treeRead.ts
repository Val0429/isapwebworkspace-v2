import { IParentData, ITreeChildren } from '@/config/default/api/interfaces';

declare namespace TreeRead {
    export interface Input {

    }

    export interface Output {
        objectId: string;
        parentId: string;
        type: string;
        data: IParentData;
        lft: number;
        rgt: number;
        childrens: ITreeChildren[];
    }


}

export default TreeRead;
