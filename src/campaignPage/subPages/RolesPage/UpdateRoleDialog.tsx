import React, {useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Role from "../../../models/role";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";

interface UpdateRoleDialogProps {
    role: Role | null;
    closeDialog: () => void;
    fetch: () => Promise<void>;
}

export const UpdateRoleDialog = (props: UpdateRoleDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const nameRef  = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const levelRef = useRef<HTMLInputElement>(null);
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [levelError, setLevelError] = useState(false);

    const updateTransaction = async () => {
        if (!nameRef.current || !descriptionRef.current || !levelRef.current) {
            return;
        }

        let error = false;
        if (nameRef.current.value === "") {
            setNameError(true);
            error = true;
        } else {
            setNameError(false);
        }


        if (descriptionRef.current.value === "") {
            setDescError(true);
            error = true;
        } else {
            setDescError(false);
        }

        if (levelRef.current.value === "") {
            setLevelError(true);
            error = true;
        } else {
            setLevelError(false);
        }

        if (error) {
            return;
        }

        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.UpdateRole + campaignGuid,
            {
                RoleName: props.role?.roleName,
                RoleDescription: descriptionRef.current.value,
                RoleLevel: props.role?.roleLevel,
                IsCustomRole: true,
            },
        );
        await props.fetch();
        props.closeDialog();
    };

    return (
        <Dialog open={props.role !== null} onClose={props.closeDialog}>
            <DialogTitle>Update Role {props.role?.roleName}</DialogTitle>
            <DialogContent>
            <TextField fullWidth margin="dense" label="Role Description" inputRef={descriptionRef} error={descError}
                           helperText={""} defaultValue={props.role?.roleDescription} multiline maxRows={4}
                sx={{width:"450px"}}/>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={updateTransaction}>Confirm</Button>
                <Button fullWidth onClick={props.closeDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};