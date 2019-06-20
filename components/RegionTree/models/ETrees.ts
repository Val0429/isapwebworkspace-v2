enum ETreeEventType {
    none = 'none',
    clickBar = 'clickBar',
    shiftClickBar = 'shiftClickBar',
}

enum ERegionType {
    none = 'none',
    root = 'root',
    region = 'region',
    globe = 'globe',
    state = 'state',
    country = 'country',
    city = 'city',
    township = 'township',
    road = 'road',
    site = 'site',
    store = 'store',
    floor = 'floor',
    area = 'area',
    door = 'door',
}

enum ERegionTreeToolboxType {
    bindingSite = 'bindingSite',
    addNextLayerRegion = 'addNextLayerRegion',
    addSameLayerRegion = 'addSameLayerRegion',
    editRoot = 'editRoot',
    editRegion = 'editRegion',
    deleteRegion = 'deleteRegion',
    divider = 'divider',
    none = 'none',
}

export { ERegionType, ETreeEventType, ERegionTreeToolboxType };
