import { ESortSelectTreeEventType } from './ESortSelectTree';

interface ISortSelectTreeOption {
    value: string;
    text: string;
    childrens: ISortSelectTreeOption[];
}

interface ISortSelectTreeEvent {
    clickCheckbox: boolean;
    clickCheckboxType: ESortSelectTreeEventType;
}

interface ISortSelectTreeStatus {
    chooseFocus: boolean;
    optionFocus: boolean;
    choose: boolean;
    childrenChoose: boolean;
}

interface ISortSelectTreeItem {
    value: string;
    text: string;
    event: ISortSelectTreeEvent;
    status: ISortSelectTreeStatus;
    childrens: ISortSelectTreeItem[];
}
export { ISortSelectTreeOption, ISortSelectTreeEvent, ISortSelectTreeStatus, ISortSelectTreeItem };
