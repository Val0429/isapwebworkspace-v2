interface ISiteItems {
    value: string; //ObjectId
    text: string; //Site Name
    officeHour: any[]; //officeTime
}

interface IPeckTimeRange {
    site: string;
    head: number[];
    body: IPeckTimeRangeBody[];
}

interface IPeckTimeRangeBody {
    title: string;
    context: context[];
}

interface context {
    time: string;
    value: number;
}

export { IPeckTimeRange, IPeckTimeRangeBody, ISiteItems };
