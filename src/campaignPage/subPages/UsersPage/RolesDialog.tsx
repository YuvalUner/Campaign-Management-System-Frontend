import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Role from "../../../models/role";
import UserWithRole from "../../../models/user-with-role";
import Grid from "@mui/material/Unstable_Grid2";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";

interface RolesDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    refresh: () => void;
    roles: Role[] | null;
    userToChange: UserWithRole | null;
}


export const RolesDialog = (props: RolesDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [chosenRole, setChosenRole] = useState<string>();
    const [sendSMS, setSendSMS] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);

    useEffect(() => {
        setChosenRole(props.userToChange?.roleName);
    }, [props.userToChange]);

    const assignRole = async (role: Role) => {
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.AssignRole + `${campaignGuid}/${props.userToChange?.email}`,
            role,
            null,
            {
                FirstNameHeb: props.userToChange?.firstNameHeb,
                LastNameHeb: props.userToChange?.lastNameHeb,
                PhoneNumber: props.userToChange?.phoneNumber,
                Email: props.userToChange?.email,
                ViaEmail: sendEmail,
                ViaSms: sendSMS,
            },
        );
        props.refresh();
        await props.switchMode();
    };

    const assignAdminRole = async (role: Role) => {
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.AssignAdminRole + `${campaignGuid}/${props.userToChange?.email}`,
            role,
            null,
            {
                FirstNameHeb: props.userToChange?.firstNameHeb,
                LastNameHeb: props.userToChange?.lastNameHeb,
                PhoneNumber: props.userToChange?.phoneNumber,
                Email: props.userToChange?.email,
                ViaEmail: sendEmail,
                ViaSms: sendSMS,
            },
        );
        props.refresh();
        await props.switchMode();
    };

    const changeRole = async () => {
        const role = props.roles?.find((role) => role.roleName === chosenRole);

        if (role === undefined) {
            console.log("role is not in list");
            return;
        }

        if (role.roleLevel === 0) {
            await assignRole(role);
        } else {
            await assignAdminRole(role);
        }
    };

    const colorPicker = (roleName: string) => {
        if (roleName === chosenRole) {
            return "success";
        } else if (roleName === props.userToChange?.roleName) {
            return "info";
        }
        return undefined;

    };

    return (
        <>
            <Dialog open={props.isOpen} onClose={props.switchMode}>
                <DialogTitle>Change Role</DialogTitle>
                <DialogContent>
                    <Stack direction={"column"} spacing={3}>
                        <Grid container spacing={3}>
                            {props.roles?.map((role, i) =>
                                <Grid key={role.roleName}>
                                    <Chip color={colorPicker(role.roleName)}
                                          onClick={() => setChosenRole(role.roleName)} label={role.roleName}/>
                                </Grid>,
                            )}
                        </Grid>
                        <FormControlLabel label="Send SMS" control={<Switch checked={sendSMS}
                                                                            onChange={(e) => setSendSMS(e.target.checked)}/>}/>
                        <FormControlLabel label="Send Email" control={<Switch checked={sendEmail}
                                                                              onChange={(e) => setSendEmail(e.target.checked)}/>}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={changeRole}
                            disabled={chosenRole === props.userToChange?.roleName}>Change</Button>
                    <Button fullWidth onClick={props.switchMode}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};