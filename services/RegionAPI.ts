import { IRegionItem, RegionTreeItem, ERegionType } from '@/components/RegionTree';
import ServerConfig from '@/services/ServerConfig';

export class RegionAPI {
    regionTreeItem = new RegionTreeItem();

    analysisApiResponse(value: any): IRegionItem {
        let result = this.analysisRegionTree(value);
        return JSON.parse(JSON.stringify(result));
    }

    private analysisRegionTree(value: any): IRegionItem {
        let regionItem: IRegionItem = this.regionTreeItem.regionItem;
        if (value.objectId != undefined) {
            regionItem.objectId = value.objectId;
        }
        if (value.parentId != undefined) {
            regionItem.parentId = value.parentId;
        }

        if (value.data != undefined) {
            if (value.data.name != undefined) {
                regionItem.name = value.data.name;
            }
            if (value.data.customId != undefined) {
                regionItem.customId = value.data.customId;
            }
            if (value.data.address != undefined) {
                regionItem.address = value.data.address;
            }
            if (value.data.longitude != undefined) {
                regionItem.lng = value.data.longitude;
                regionItem.location.lng = value.data.longitude;
            }
            if (value.data.latitude != undefined) {
                regionItem.lat = value.data.latitude;
                regionItem.location.lat = value.data.latitude;
            }
            if (value.data.imageSrc != undefined) {
                regionItem.photoSrc = ServerConfig.url + value.data.imageSrc;
            }
            if (value.data.mapSrc != undefined) {
                regionItem.imageMapSrc = ServerConfig.url + value.data.mapSrc;
            }
            if (value.data.tags != undefined) {
                for (let tempTagRes of value.data.tags) {
                    regionItem.tags.push({
                        objectId: tempTagRes.objectId,
                        name: tempTagRes.name,
                    });
                }
            }
        }

        if (value.type != undefined) {
            switch (value.type) {
                case 'root':
                    regionItem.type = ERegionType.root;
                    if (this.regionTreeItem.toggleStatus.region || this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) {
                        regionItem.status.showCard = true;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
                case 'site':
                    regionItem.type = ERegionType.site;
                    if (this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) {
                        regionItem.status.showCard = true;
                        regionItem.status.showBar = true;
                    } else {
                        regionItem.status.showCard = false;
                        regionItem.status.showBar = false;
                    }
                    break;
                case 'area':
                    regionItem.type = ERegionType.area;
                    if (this.regionTreeItem.toggleStatus.site) {
                        regionItem.status.showCard = true;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
                case 'region':
                case 'globe':
                default:
                    regionItem.type = ERegionType.region;
                    if (this.regionTreeItem.toggleStatus.region || this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) {
                        regionItem.status.showCard = true;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
            }
        }
        if (value.childrens != undefined) {
            for (let childrenvalue of value.childrens) {
                regionItem.children.push(this.analysisRegionTree(childrenvalue));
            }
        }
        return regionItem;
    }

    analysisRegionTreeFilterSite(value: any, allowSites: any): IRegionItem {
        let regionItem: IRegionItem = this.regionTreeItem.regionItem;
        if (value.objectId != undefined) {
            regionItem.objectId = value.objectId;
        }
        if (value.parentId != undefined) {
            regionItem.parentId = value.parentId;
        }

        if (value.data != undefined) {
            if (value.data.name != undefined) {
                regionItem.name = value.data.name;
            }
            if (value.data.customId != undefined) {
                regionItem.customId = value.data.customId;
            }
            if (value.data.address != undefined) {
                regionItem.address = value.data.address;
            }
            if (value.data.longitude != undefined) {
                regionItem.lng = value.data.longitude;
                regionItem.location.lng = value.data.longitude;
            }
            if (value.data.latitude != undefined) {
                regionItem.lat = value.data.latitude;
                regionItem.location.lat = value.data.latitude;
            }
            if (value.data.imageSrc != undefined) {
                regionItem.photoSrc = ServerConfig.url + value.data.imageSrc;
            }
            if (value.data.mapSrc != undefined) {
                regionItem.imageMapSrc = ServerConfig.url + value.data.mapSrc;
            }
            if (value.data.tags != undefined) {
                for (let tempTagRes of value.data.tags) {
                    regionItem.tags.push({
                        objectId: tempTagRes.objectId,
                        name: tempTagRes.name,
                    });
                }
            }
        }

        if (value.type != undefined) {
            switch (value.type) {
                case 'root':
                    regionItem.type = ERegionType.root;
                    if (this.regionTreeItem.toggleStatus.region || this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) {
                        regionItem.status.showCard = true;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
                case 'site':
                    regionItem.type = ERegionType.site;
                    regionItem.status.showCard = false;

                    for (const detail of allowSites) {
                        if ((this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) && detail.objectId === value.objectId) {
                            regionItem.status.showCard = true;
                            break;
                        } else if (this.regionTreeItem.toggleStatus.site && detail.objectId !== value.objectId) {
                            regionItem.status.showCard = false;
                        } else {
                            regionItem.status.showCard = false;
                        }
                    }
                    break;
                case 'area':
                    regionItem.type = ERegionType.area;
                    if (this.regionTreeItem.toggleStatus.site) {
                        regionItem.status.showCard = false;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
                case 'region':
                case 'globe':
                default:
                    regionItem.type = ERegionType.region;
                    if (this.regionTreeItem.toggleStatus.region || this.regionTreeItem.toggleStatus.site || this.regionTreeItem.toggleStatus.area) {
                        regionItem.status.showCard = true;
                    } else {
                        regionItem.status.showCard = false;
                    }
                    break;
            }
        }
        if (value.childrens != undefined) {
            for (let childrenvalue of value.childrens) {
                regionItem.children.push(this.analysisRegionTreeFilterSite(childrenvalue, allowSites));
            }
        }
        return JSON.parse(JSON.stringify(regionItem));
    }
}

export default new RegionAPI();
