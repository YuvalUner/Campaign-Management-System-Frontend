import React, {useRef, useState} from "react";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import FinancialType from "../../../../models/financialType";

interface UpdateTransactionTypeDialogProps {
    transactionType: FinancialType | null;
    closeDialog: () => void;
    fetch: () => Promise<void>;
}

const UpdateTransactionTypeDialog = (props: UpdateTransactionTypeDialogProps) => {
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

        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.FinancialTypes.Base +
            config.ControllerUrls.FinancialTypes.UpdateFinancialType +
            campaignGuid,
            {
                TypeName: nameRef.current?.value,
                TypeDescription: descriptionRef.current?.value,
                campaignGuid: campaignGuid,
                TypeGuid: props.transactionType?.typeGuid,
            },
        );
        await props.fetch();
        props.closeDialog();
    };


    return (
        <Dialog open={props.transactionType !== null} onClose={props.closeDialog}>
            <DialogTitle>Add Transaction Type</DialogTitle>
            <DialogContent>
                <TextField fullWidth autoFocus margin="dense" label="type name" inputRef={nameRef} error={nameError}
                    helperText={"cannot be empty or more then 100 chars"}
                    defaultValue={props.transactionType?.typeName}/>
                <TextField fullWidth margin="dense" label="description" error={descError}
                    helperText={"cannot be more then 300 chars"} inputRef={descriptionRef}
                    defaultValue={props.transactionType?.typeDescription}/>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={addType}>Confirm</Button>
                <Button fullWidth onClick={props.closeDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateTransactionTypeDialog;
