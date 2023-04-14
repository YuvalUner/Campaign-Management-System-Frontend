import React from "react";
import Permission, {PermissionTargets} from "../../models/permission";
import MenuListItem from "./menu-list-item";
import BallotIcon from "@mui/icons-material/Ballot";
import SubPageNames from "./sub-page-names";
import ErrorIcon from "@mui/icons-material/Error";
import SubScreenRoutes from "./sub-screen-routes";

/**
 * A function for mapping between permissions and the tabs they grant access to.
 * @param permission The permission to map.
 * @param campaignGuid
 */
function PermissionToTabMapper(permission: Permission, campaignGuid: string): MenuListItem {
    switch (permission.permissionTarget) {
    case PermissionTargets.VotersLedger:
        return {
            name: SubPageNames.VotersLedger,
            icon: <BallotIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.VotersLedgerComponent,
        };
    default:
        return {
            name: "Unknown",
            icon: <ErrorIcon/>,
            navTo: "Error",
        };
    }
}

export default PermissionToTabMapper;
