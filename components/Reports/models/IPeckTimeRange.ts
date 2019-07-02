interface ISiteItems {
    value: string; //ObjectId
    text: string; //Site Name
}

interface IPeckTimeRange {
    site: string;
    head: string[];
    body: IPeckTimeRangeBody[];
}

interface IPeckTimeRangeBody {
    title: string;
    context: number[];
}

export { IPeckTimeRange, ISiteItems };
