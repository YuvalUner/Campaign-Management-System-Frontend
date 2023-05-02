import React from "react";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import Events from "../../../../../utils/helperMethods/events";
import DialogProps from "./dialog-props";
import handleServerErrorForDialog from "./handle-server-error-for-dialog";

function UpdateNameDialog(props: DialogProps): JSX.Element {

    let newName = "";
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        newName = event.target.value;
    };

    const updateName = () => {
        const updatedLedger: CustomVotersLedger = {
            ledgerName: newName,
            ledgerGuid: props.customLedger.ledgerGuid,
        } as CustomVotersLedger;
        ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.CustomVotersLedger.Base
            + config.ControllerUrls.CustomVotersLedger.UpdateLedgerName + props.campaignGuid,
            updatedLedger
        ).then(() => {
            Events.dispatch(Events.EventNames.RefreshCustomLedgers);
        }).catch((error) => {
            handleServerErrorForDialog(error);
        }).finally(() => {
            props.onClose();
            newName = "";
        });
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Update ledger name</DialogTitle>
            <DialogContent>
                <Stack spacing={2} direction={"column"}>
                    <Typography variant={"body1"}>Current name: {props.customLedger.ledgerName}</Typography>
                    <TextField onChange={onChange} variant={"outlined"} label={"New name"}/>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={updateName}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateNameDialog;
