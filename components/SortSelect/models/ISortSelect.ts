interface ISortSelectOption {
    value: string;
    text: string;
}

interface ISortSelectTreeOption {
    value: string;
    text: string;
    childrens: ISortSelectTreeOption[];
}

export { ISortSelectOption, ISortSelectTreeOption };
