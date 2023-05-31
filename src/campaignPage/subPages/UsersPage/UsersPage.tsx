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

interface UsersPageProps {
    campaign: Campaign | null;
}

const dialogTemplate = (props: any) => {
    return (
        <>
        </>
    );
};


export const UsersPage = (props: UsersPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [admins, setAdmins] = useState<Admin[] | null>(null);
    const [roles, setRoles] = useState<Role[] | null>(null);

    const [rolesDialogData, setRolesDialogData] = useState<UserWithRole | null>(null);

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


    const getUsers = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetCampaignUsers + campaignGuid,
        );
        const types = res.data as UserWithRole[];
        console.dir(types);
        setUsers(types);
    };

    const getAdmins = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetCampaignAdmins + campaignGuid,
        );
        const admins = res.data as Admin[];
        console.dir(admins);
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

    useEffect(() => {
        getUsers();
        getAdmins();
        getRoles();
    }, []);

    const addUser = async (props: any, props2: any) => {
        console.dir("save");
    };


    const RolesButtonTemplate = (props: UserWithRole) => {
        return (
            <Chip label={props.roleName} variant="outlined" onClick={() => setRolesDialogData(props)}/>
        );
    };

    return (
        <>
            <RolesDialog isOpen={rolesDialogData !== null} switchMode={() => setRolesDialogData(null)}
                         refresh={refreshGrid} roles={roles} user={rolesDialogData}/>
            <GridComponent dataSource={users ?? []} ref={g => grid = g} editSettings={editSettings}
                           toolbar={toolbarOptions}>
                <ColumnsDirective>
                    <ColumnDirective field="roleName" headerText="Role" template={RolesButtonTemplate}/>
                    <ColumnDirective field="firstNameEng" headerText="First Name"/>
                    <ColumnDirective field="lastNameEng" headerText="Last Name"/>
                    <ColumnDirective field="firstNameHeb" headerText="First Name"/>
                    <ColumnDirective field="lastNameHeb" headerText="Last Name"/>
                    <ColumnDirective field="roleName" headerText="Role"/>
                    <ColumnDirective field="email" headerText="Email"/>
                </ColumnsDirective>
                <Inject services={[Edit, Toolbar]}/>
            </GridComponent>
        </>
    );
};