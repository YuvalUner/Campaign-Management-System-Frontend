import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import Role, {builtInRoleNames} from "../../../models/role";
import {useParams} from "react-router-dom";
import {DeleteDialog} from "../FinancialPage/DeleteDialog";
import {Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import {Button} from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Sync";
import AddRoleDialog from "./AddRoleDialog";
import {UpdateRoleDialog} from "./UpdateRoleDialog";
import axios from "axios";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import IncomeIcon from "@mui/icons-material/CallReceived";
import AdminIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from '@mui/icons-material/Person';
interface RolesPageProps {
    campaign: Campaign | null;
}

export const RolesPage = (props: RolesPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [roles, setRoles] = useState<null | Role[]>(null);

    const getRoles = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.GetRoles + campaignGuid,
        );
        const types = res.data as Role[];
        types.sort((a, b) => {
            if (a.roleLevel !== undefined && b.roleLevel !== undefined && a.roleLevel !== b.roleLevel) {
                return -(a.roleLevel - b.roleLevel);
            }
            return a.roleName.localeCompare(b.roleName);
        });
        console.dir(types);
        setRoles(types);
    };

    useEffect(() => {
        getRoles();
    }, []);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [updateDialogData, setUpdateDialogData] = useState<Role | null>(null);
    const [deleteDialogData, setDeleteDialogData] = useState<Role | null>(null);

    const switchAddTransactionMode = () => {
        setIsAddDialogOpen((prev) => !prev);
    };

    const openUpdateDialog = (role: Role) => {
        setUpdateDialogData(role);
    };
    const closeUpdateDialog = () => {
        setUpdateDialogData(null);
    };

    const openDeleteDialog = (role: Role) => {
        setDeleteDialogData(role);
    };
    const closeDeleteDialog = () => {
        setDeleteDialogData(null);
    };

    const onDeleteIconClick = async (role: Role) => {
        const res = await axios.delete(
            config.ServerBaseUrl + config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.DeleteRole + campaignGuid, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                data: role,
            },
        );
        await getRoles();
    };

    return (
        <>
            {updateDialogData !== null &&
                <UpdateRoleDialog role={updateDialogData} closeDialog={closeUpdateDialog} fetch={getRoles}/>}
            <AddRoleDialog isOpen={isAddDialogOpen} switchMode={switchAddTransactionMode} fetch={getRoles}/>
            <DeleteDialog values={deleteDialogData} switchMode={closeDeleteDialog} action={onDeleteIconClick}/>

            <Box sx={{width: "100%", height: `calc(100% - ${Constants.topMenuHeight}px)`, marginTop: "10px"}}>
                <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                    <Typography variant="h5" sx={{flexGrow: "1"}}>
                        Roles
                    </Typography>
                    <Button onClick={switchAddTransactionMode}>Add Role <AddIcon/></Button>
                </Stack>
                <List>
                    {roles?.map((role) =>
                        <ListItem key={role.roleName}
                                  secondaryAction={builtInRoleNames.includes(role.roleName) ? undefined :
                                      <Stack direction="row" spacing={2}>
                                          <IconButton aria-label="delete"
                                                      onClick={() => openDeleteDialog(role)}>
                                              <DeleteIcon/>
                                          </IconButton>
                                          <IconButton aria-label="update"
                                                      onClick={() => openUpdateDialog(role)}>
                                              <UpdateIcon/>
                                          </IconButton>
                                      </Stack>
                                  }>
                            <ListItemIcon>
                                {role.roleLevel !== 0
                                    ? <AdminIcon color="warning"/>
                                    : <PersonIcon color="success"/>}
                            </ListItemIcon>
                            <ListItemText
                                primary={role.roleName}
                                secondary={`level: ${role.roleLevel}\n${role.roleDescription}`}
                            />
                        </ListItem>,
                    )}
                </List>
            </Box>
        </>
    );
};