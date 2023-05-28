import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import Role from "../../../models/role";
import {useParams} from "react-router-dom";
import {DeleteDialog} from "../FinancialPage/DeleteDialog";
import {IconButton, List, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import {Button} from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Sync";
import {format} from "date-fns";
import AddRoleDialog from "./AddRoleDialog";
import {UpdateRoleDialog} from "./UpdateRoleDialog";

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
                return a.roleLevel - b.roleLevel;
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
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.DeleteRole + campaignGuid,
        );
        await getRoles();
    };

    return (
        <>
            {updateDialogData !== null &&
                <UpdateRoleDialog role={updateDialogData} closeDialog={closeUpdateDialog} fetch={getRoles}/>}
            <AddRoleDialog isOpen={isAddDialogOpen} switchMode={switchAddTransactionMode} fetch={getRoles}/>
            <DeleteDialog values={deleteDialogData} switchMode={closeDeleteDialog} action={onDeleteIconClick}/>

            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    Transactions
                </Typography>
                <Button onClick={switchAddTransactionMode}>Add Transaction <AddIcon/></Button>
            </Stack>
            <List>
                {roles?.map((role) =>
                    <ListItem key={role.roleName} secondaryAction={
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
                        <ListItemText
                            primary={role.roleName}
                            secondary={`level: ${role.roleLevel}\n${role.roleDescription}`}
                        />
                    </ListItem>,
                )}
            </List>
        </>
    );
};
