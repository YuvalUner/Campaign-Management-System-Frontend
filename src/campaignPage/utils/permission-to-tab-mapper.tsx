import React from "react";
import Permission, {PermissionTargets} from "../../models/permission";
import MenuListItem from "./menu-list-item";
import BallotIcon from "@mui/icons-material/Ballot";
import SettingsIcon from "@mui/icons-material/SettingsApplications";
import SubPageNames from "./sub-page-names";
import ErrorIcon from "@mui/icons-material/Error";
import SubScreenRoutes from "./sub-screen-routes";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

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
    case PermissionTargets.CampaignSettings:
        return {
            name: SubPageNames.Settings,
            icon: <SettingsIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.SettingsComponent,
        };
    case PermissionTargets.CustomLedger:
        return {
            name: SubPageNames.UploadCustomLedger,
            icon: <BookmarkAddIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.UploadCustomLedgerComponent,
        };
    case PermissionTargets.Financial:
        return {
            name: SubPageNames.Financial,
            icon: <MoneyIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.FinancialComponent,
        };
    case PermissionTargets.CampaignUsersList:
        return {
            name: SubPageNames.CampaignUsers,
            icon: <PeopleIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.CampaignUsersComponent,
        };
    case PermissionTargets.CampaignRolesList:
        return {
            name: SubPageNames.CampaignRoles,
            icon: <WorkIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.CampaignRolesComponent,
        };
    case PermissionTargets.CampaignAdvisor:
        return {
            name: SubPageNames.CampaignAdvisor,
            icon: <AutoAwesomeIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.CampaignAdvisorComponent,
        };
    case PermissionTargets.JobTypes:
        return {
            name: SubPageNames.JobTypes,
            icon: <AssignmentIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.JobTypes,
        };
    case PermissionTargets.Jobs:
        return {
            name: SubPageNames.Jobs,
            icon: <AssignmentIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.Jobs,
        };
    case PermissionTargets.BallotManagement:
        return {
            name: SubPageNames.BallotManagement,
            icon: <HowToVoteIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.BallotManagementComponent,
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
