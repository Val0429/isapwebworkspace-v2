export const PermissionName={
    user:"1-1_user_Permission_CRUD",
    userManagement:"1-2_user_Management_CRUD",
    reportDoor:"2-2_report_door_R",
    reportEmployee:"2-1_report_member_R",
    reportDoorGroup:"2-3_report_doorgroup_R",
    reportCard:"2-4_report_card_R",
    reportContractor:"2-5_report_contractor_R",
    reportDemographic:"2-6_report_demographic_R",
    reportAttendance:"2-7_report_attendance_R",
    reportVisitor:"2-8_report_visitor_R",
    permissionTable:"3-3_door_permissiontable_CRUD",
    member:"3-2_door_member_CRUD",
    region:"4-3_location_region_CRUD",
    site:"4-2_location_site_CRUD",
    doorgroup:"5-2_door_doorgroup_CRUD",
    door:"5-1_door_door_CRUD",
    reader:"5-5_door_reader_CRUD",
    elevatorgroup:"5-6_door_elevatorgroup_CRUD",
    elevator:"5-4_door_elevator_CRUD",
    floor:"5-3_door_floor_CRUD",
    syncreceiver:"6-1_notification_sync_CRUD",
    area:"4-1_location_area_CRUD",
    accessLevel:"3-1_door_accesslevel_CRUD",
    humanResource:"7-1_system_hurmanresource_CRUD",
    systemLicense:"7-2_system_license_CRUD",
    operationLog:"7-3_system_operationlog_R"
};
export const PermissionList = [
    {key:PermissionName.user, route :"/userpermission", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.userManagement, route :"/user", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.reportEmployee, route :"/employeereport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportDoor, route :"/doorreport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportDoorGroup, route :"/doorgroupreport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportCard, route :"/cardreport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportContractor, route :"/contractorreport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportDemographic, route :"/demographicreport", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportAttendance, route :"/attendance", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.reportVisitor, route :"/visitorreport", access:{C:false,R:true,U:false,D:false}},

    {key:PermissionName.accessLevel, route :"", access:{C:false,R:false,U:false,D:false}},
    {key:PermissionName.member, route :"/member", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.permissionTable, route :"/permissiontable", access:{C:true,R:true,U:true,D:true}},

    {key:PermissionName.area, route :"", access:{C:false,R:false,U:false,D:false}},
    {key:PermissionName.site, route :"/site", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.region, route :"/region", access:{C:true,R:true,U:true,D:true}},

    {key:PermissionName.door, route :"/door", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.doorgroup, route :"/doorgroup", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.floor, route :"/floor", access:{C:false,R:true,U:false,D:false}},
    {key:PermissionName.elevatorgroup, route :"/elevatorgroup", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.elevator, route :"/elevator", access:{C:true,R:true,U:true,D:true}},
    {key:PermissionName.reader, route :"/reader", access:{C:true,R:true,U:true,D:true}},

    {key:PermissionName.syncreceiver, route :"/syncreceiver", access:{C:true,R:true,U:true,D:true}},

    {key:PermissionName.humanResource, route :"", access:{C:false,R:false,U:false,D:false}},
    {key:PermissionName.systemLicense, route :"", access:{C:false,R:false,U:false,D:false}},
    {key:PermissionName.operationLog, route :"", access:{C:false,R:false,U:false,D:false}}
    
];