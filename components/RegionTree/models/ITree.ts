import { ERegionType } from './ETrees';

// 座標
interface ILocation {
    // 緯度 -90 ~ 90
    lat: number;

    // 經度 -180 ~ 180
    lng: number;
}

interface ITreeEvent {
    clickBar: boolean;
    shiftClickBar: boolean;
}

interface ITreeStatus {
    focusBar: boolean;
    showBar: boolean;
    showCard: boolean;
    showToggle: boolean;
    searchBar: boolean;
}

interface IRegionTreeToggleStatus {
    region: boolean;
    site: boolean;
    area: boolean;
}

interface IRegionTreeTag {
    objectId: string;
    name: string;
}

interface IRegionItem {
    objectId: string;
    parentId: string;
    customId: string;
    type: ERegionType;
    name: string;
    address: string;
    photoSrc: string;
    imageMapSrc: string;
    lat: number;
    lng: number;
    location: ILocation;
    event: ITreeEvent;
    status: ITreeStatus;
    sites: string[];
    tags: IRegionTreeTag[];
    children: IRegionItem[];
}

interface IRegionTreeTitle {
    card: string;
    address: string;
    map: string;
    edit: string;
    backButton: string;
}

interface IRegionTreeSelected {
    objectId: string;
    type: ERegionType;
    name: string;
}

export { ILocation };
export { ITreeEvent, ITreeStatus };
export { IRegionItem, IRegionTreeTag, IRegionTreeToggleStatus, IRegionTreeTitle, IRegionTreeSelected };
