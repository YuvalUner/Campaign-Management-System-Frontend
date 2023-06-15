import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import {
    ColumnDirective,
    ColumnsDirective,
    Edit,
    EditSettingsModel,
    Grid,
    GridComponent,
    Inject,
    Toolbar,
    ToolbarItems,
} from "@syncfusion/ej2-react-grids";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import Admin from "../../../models/admin";
import UserWithRole from "../../../models/user-with-role";
import {Chip} from "@mui/material";
import Role from "../../../models/role";
import {RolesDialog} from "./RolesDialog";
import User from "../../../models/user";
import {PermissionsDialog} from "./PermissionsDialog";
import permission from "../../../models/permission";

interface UsersPageProps {
    campaign: Campaign | null;
}


export const UsersPage = (props: UsersPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [admins, setAdmins] = useState<Admin[] | null>(null);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [rolesDialogData, setRolesDialogData] = useState<UserWithRole | null>(null);
    const [permissionsDialogData, setPermissionsDialogData] = useState<UserWithRole | null>(null);
    const [selfPermissions, setSelfPermissions] = useState<permission[] | null>(null);

    let grid: Grid | null;

    const refreshGrid = () => {
        grid?.refresh();
    };

    const editSettings: EditSettingsModel = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Dialog",
        // template: dialogTemplate,
    };

    const toolbarOptions: ToolbarItems[] = ["Add", "Edit", "Delete", "Update", "Cancel"];

    const getUserInfo = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetProfilePageInfo,
        );
        setCurrentUser(res.data);
    };

    const getUsers = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetCampaignUsers + campaignGuid,
        );
        const types = res.data as UserWithRole[];
        setUsers(types);
    };

    const getAdmins = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetCampaignAdmins + campaignGuid,
        );
        const admins = res.data as Admin[];
        setAdmins(admins);
    };

    const getRoles = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.GetRoles + campaignGuid,
        );
        const roles = res.data as Role[];
        roles.sort((a, b) => {
            if (a.roleLevel !== undefined && b.roleLevel !== undefined && a.roleLevel !== b.roleLevel) {
                return -(a.roleLevel - b.roleLevel);
            }
            return a.roleName.localeCompare(b.roleName);
        });
        setRoles(roles);
    };

    const getSelfPermissions = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Permissions.Base +
            config.ControllerUrls.Permissions.GetSelfPermissions +
            campaignGuid,
        );
        const permissions = res.data as permission[];
        setSelfPermissions(permissions);
    };

    useEffect(() => {
        getUserInfo();
        getUsers();
        getAdmins();
        getRoles();
        getSelfPermissions();
    }, []);

    const RolesButtonTemplate = (props: UserWithRole) => {
        return (
            <Chip label={props.roleName} variant="outlined" onClick={() => setRolesDialogData(props)}/>
        );
    };

    const PermissionsButtonTemplate = (props: UserWithRole) => {
        return (
            <Chip label="Permissions" variant="outlined" onClick={() => setPermissionsDialogData(props)}/>
        );
    };

    return (
        <>
            <RolesDialog isOpen={rolesDialogData !== null} switchMode={() => setRolesDialogData(null)}
                refresh={getUsers} roles={roles} userToChange={rolesDialogData}/>
            <PermissionsDialog isOpen={permissionsDialogData !== null} switchMode={() => setPermissionsDialogData(null)}
                refresh={getUsers} userToChange={permissionsDialogData}
                currentUserPermissions={selfPermissions}/>
            <GridComponent dataSource={users ?? []} ref={g => grid = g} editSettings={editSettings}
                toolbar={toolbarOptions}>
                <ColumnsDirective>
                    <ColumnDirective field="roleName" headerText="Role" template={RolesButtonTemplate}/>
                    <ColumnDirective field="firstNameEng" headerText="First Name"/>
                    <ColumnDirective field="lastNameEng" headerText="Last Name"/>
                    <ColumnDirective field="firstNameHeb" headerText="First Name"/>
                    <ColumnDirective field="lastNameHeb" headerText="Last Name"/>
                    <ColumnDirective field="email" headerText="Email"/>
                    <ColumnDirective headerText="Permissions" template={PermissionsButtonTemplate}/>
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar]}/>
            </GridComponent>
        </>
    );
};
