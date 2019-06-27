export class SiteFilter {
    constructor() {}

    siteFilterPermission(allowSites: any): any {
        let tempAllowSitesSelectItem = {};

        for (const detail of allowSites) {
            tempAllowSitesSelectItem[detail.objectId] = detail.name;
        }

        return tempAllowSitesSelectItem;
    }
}

export default new SiteFilter();
