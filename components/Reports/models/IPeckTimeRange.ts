interface IPeckTimeRange {
    head: string[];
    body: IPeckTimeRangeBody[];
}

interface IPeckTimeRangeBody {
    title: string;
    context: number[];
}

export { IPeckTimeRange };
