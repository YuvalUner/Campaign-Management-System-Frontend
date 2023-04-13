interface Permission {
    permissionType: string;
    permissionTarget: string;
}

const PermissionTargets = {
    CampaignSettings: "Campaign Settings",
    Permissions: "Permissions",
    VotersLedger: "Voters Ledger",
    CampaignUsersList: "Campaign Users List",
    CampaignRolesList: "Campaign Roles List",
    Jobs: "Jobs",
    JobTypes: "Job Types",
    Sms: "SMS",
    Events: "Events",
    Publishing: "Publishing",
    Financial: "Financial",
};

const PermissionTypes = {
    View: "view",
    Edit: "edit",
};

function comparePermissions (a: Permission, b: Permission): boolean {
    return a.permissionTarget === b.permissionTarget && a.permissionType === b.permissionType;
}

export default Permission;
export { PermissionTargets, PermissionTypes, comparePermissions};
