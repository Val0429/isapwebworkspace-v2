import { IRegionItem, IRegionTreeToggleStatus, IRegionTreeTitle } from './ITree';
import { ERegionType } from './ETrees';

class RegionTreeItem {
    private _regionItem: IRegionItem = {
        objectId: '',
        parentId: '',
        customId: '',
        type: ERegionType.none,
        name: '',
        address: '',
        photoSrc: '',
        imageMapSrc: '',
        lat: 0,
        lng: 0,
        location: { lat: 0, lng: 0 },
        event: { clickBar: false, shiftClickBar: false },
        status: { focusBar: false, showBar: true, showCard: true, showToggle: true, searchBar: true },
        sites: [],
        tags: [],
        children: [],
    };

    titleItem: IRegionTreeTitle = {
        card: '',
        address: '',
        map: '',
        edit: '',
    };
    region: IRegionItem = JSON.parse(JSON.stringify(this._regionItem));
    tree: IRegionItem = JSON.parse(JSON.stringify(this._regionItem));
    toggleStatus: IRegionTreeToggleStatus = {
        region: true,
        site: true,
        area: true,
    };

    constructor() {
        this.resetRegionTree();
    }

    get regionItem(): IRegionItem {
        return JSON.parse(JSON.stringify(this._regionItem));
    }

    toggleTree(regionType: ERegionType) {
        let itemType = this.changeType(regionType);
        switch (regionType) {
            case ERegionType.region:
                this.toggleStatus.region = !this.toggleStatus.region;
                break;
            case ERegionType.site:
                this.toggleStatus.site = !this.toggleStatus.site;
                break;
            case ERegionType.area:
                this.toggleStatus.area = !this.toggleStatus.area;
                break;
            case ERegionType.root:
            case ERegionType.none:
            default:
                break;
        }
        this.toggleChildrenOpen(this.tree);
    }

    resetRegion() {
        this.region = JSON.parse(JSON.stringify(this._regionItem));
    }

    resetRegionTree() {
        this.tree = JSON.parse(JSON.stringify(this._regionItem));
        this.region = this.tree;
    }

    toggleChildrenOpen(regionItem: IRegionItem) {
        let itemType = this.changeType(regionItem.type);
        switch (itemType) {
            case ERegionType.root:
                regionItem.status.showCard = this.toggleStatus.region;
                break;
            case ERegionType.site:
                regionItem.status.showBar = this.toggleStatus.site;
                regionItem.status.showCard = this.toggleStatus.area;
                break;
            case ERegionType.area:
                regionItem.status.showBar = this.toggleStatus.area && this.toggleStatus.site;
                break;
            case ERegionType.region:
            default:
                regionItem.status.showCard = this.toggleStatus.region;
                break;
        }
        regionItem.status.focusBar = false;
        for (let tempRegionItem of regionItem.children) {
            this.toggleChildrenOpen(tempRegionItem);
        }
    }

    changeType(value: ERegionType): ERegionType {
        let result = ERegionType.none;
        switch (value) {
            case ERegionType.region:
            case ERegionType.globe:
            case ERegionType.state:
            case ERegionType.country:
            case ERegionType.township:
            case ERegionType.road:
                result = ERegionType.region;
                break;
            case ERegionType.site:
            case ERegionType.store:
            case ERegionType.floor:
                result = ERegionType.site;
                break;
            case ERegionType.area:
            case ERegionType.door:
                result = ERegionType.area;
                break;
            case ERegionType.root:
            case ERegionType.none:
            default:
                result = value;
                break;
        }
        return result;
    }
}
export { RegionTreeItem };
