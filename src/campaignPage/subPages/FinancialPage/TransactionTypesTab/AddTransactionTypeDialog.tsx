import React, {useRef, useState} from "react";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useParams} from "react-router-dom";

interface AddTransactionTypeDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    fetch: () => Promise<void>;
}

const AddTransactionTypeDialog = (props: AddTransactionTypeDialogProps) => {
    const params = useParams();
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);

    const campaignGuid = params.campaignGuid;
    const addType = async () => {
        if (!nameRef.current || !descriptionRef.current) {
            return;
        }

        let error = false;
        if (nameRef.current?.value === "" || nameRef.current?.value.length > 100) {
            setNameError(true);
            error = true;
        } else {
            setNameError(false);
        }

        if (descriptionRef.current?.value === "") {
            setDescError(true);
            error = true;
        } else {
            setDescError(false);
        }

        if (error) {
            return;
        }

        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.FinancialTypes.Base + config.ControllerUrls.FinancialTypes.CreateFinancialType + campaignGuid,
            {
                TypeName: nameRef.current?.value,
                TypeDescription: descriptionRef.current?.value,
                campaignGuid: campaignGuid,
            },
        );
        await props.fetch();
        props.switchMode();
    };


    return (
        <Dialog open={props.isOpen} onClose={props.switchMode}>
            <DialogTitle>Add Transaction Type</DialogTitle>
            <DialogContent>
                <TextField fullWidth autoFocus margin="dense" label="type name" inputRef={nameRef} error={nameError}
                    helperText={"cannot be empty or more then 100 chars"}/>
                <TextField fullWidth margin="dense" label="description" error={descError}
                    helperText={"cannot be more then 300 chars"} inputRef={descriptionRef}/>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={addType}>Add</Button>
                <Button fullWidth onClick={props.switchMode}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTransactionTypeDialog;
