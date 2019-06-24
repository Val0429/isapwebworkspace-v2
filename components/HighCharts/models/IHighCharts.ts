interface ITrafficData {
    datetime: Date;
    siteId: string;
    siteName: string;
    temperature: number;
    traffic: number;
    revenue: number;
    transaction: number;
    conversion: number;
}

export { ITrafficData };
