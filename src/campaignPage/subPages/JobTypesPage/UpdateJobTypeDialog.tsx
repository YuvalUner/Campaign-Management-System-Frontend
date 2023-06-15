import React, {useEffect, useState} from "react";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {JobType} from "../../../models/jobType";

interface UpdateJobTypeDialogProps {
    type: JobType | null;
    closeDialog: () => void;
    fetch: () => Promise<void>;
}

const UpdateJobTypeDialog = (props: UpdateJobTypeDialogProps) => {
    const params = useParams();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);

    useEffect(() => {
        setName(props.type?.jobTypeName ?? "");
        setDescription(props.type?.jobTypeDescription ?? "");
    }, [props.type]);

    const campaignGuid = params.campaignGuid;
    const addType = async () => {
        if (!name || !description) {
            return;
        }

        let error = false;
        if (name === "") {
            setNameError(true);
            error = true;
        } else {
            setNameError(false);
        }

        if (description === "") {
            setDescError(true);
            error = true;
        } else {
            setDescError(false);
        }

        if (error) {
            return;
        }

        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.JobType.Base +
            config.ControllerUrls.JobType.UpdateJobType +
            `${campaignGuid}/${props.type?.jobTypeName}`,
            {
                JobTypeName: name,
                JobTypeDescription: description,
                IsCustomJobType: props.type?.isCustomJobType,
            },
        );
        await props.fetch();
        props.closeDialog();
    };

    return (
        <Dialog open={props.type !== null} onClose={props.closeDialog}>
            <DialogTitle>Add Transaction Type</DialogTitle>
            <DialogContent>
                <TextField fullWidth autoFocus margin="dense" label="type name"
                onChange={(e) => setName(e.target.value)} error={nameError}
                value={name}/>
                <TextField fullWidth margin="dense" label="description" error={descError}
                onChange={(e) => setName(e.target.value)}
                value={description}/>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={addType}>Confirm</Button>
                <Button fullWidth onClick={props.closeDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateJobTypeDialog;
