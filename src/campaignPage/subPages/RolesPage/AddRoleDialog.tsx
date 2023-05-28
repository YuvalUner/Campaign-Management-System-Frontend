import React, {useRef, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";

interface AddRoleDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    fetch: () => Promise<void>;
}

const AddRoleDialog = (props: AddRoleDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const levelRef = useRef<HTMLInputElement>(null);
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [levelError, setLevelError] = useState(false);

    const addRole = async () => {
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

        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Roles.Base + config.ControllerUrls.Roles.AddRole + campaignGuid,
            {
                RoleName: nameRef.current.value,
                RoleDescription: descriptionRef.current.value,
                RoleLevel: levelRef.current.value,
                IsCustomRole: true,
            },
        );
        await props.fetch();
        props.switchMode();
    };

    return (
        <Dialog open={props.isOpen} onClose={props.switchMode}>
            <DialogTitle>Add Role</DialogTitle>
            <DialogContent>
            <TextField fullWidth autoFocus margin="dense" label="Role Name" inputRef={nameRef} error={nameError}
                           helperText={""}/>
                <TextField fullWidth margin="dense" label="Role Description" inputRef={descriptionRef} error={descError}
                           helperText={""}/>
                <TextField fullWidth margin="dense" label="Role Level" type={"number"} inputRef={levelRef}
                           error={levelError} helperText={""}/>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={addRole}>Add</Button>
                <Button fullWidth onClick={props.switchMode}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRoleDialog;