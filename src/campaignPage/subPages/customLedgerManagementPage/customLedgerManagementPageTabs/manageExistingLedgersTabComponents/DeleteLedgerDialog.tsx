import React from "react";
import DialogProps from "./dialog-props";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import Events from "../../../../../utils/helperMethods/events";
import handleServerErrorForDialog from "./handle-server-error-for-dialog";

function DeleteLedgerDialog(props: DialogProps): JSX.Element {

    const deleteLedger = () => {
        ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.CustomVotersLedger.Base + config.ControllerUrls.CustomVotersLedger.DeleteLedger
             + props.campaignGuid + "/" + props.customLedger.ledgerGuid
        ).then(() => {
            Events.dispatch(Events.EventNames.RefreshCustomLedgers);
        }).catch((error) => {
            handleServerErrorForDialog(error);
        }).finally(() => {
            props.onClose();
        });
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Update ledger name</DialogTitle>
            <DialogContent>
                <Typography variant={"body1"}>Are you sure you want to delete
                    <b>{" " + props.customLedger.ledgerName}</b>?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={deleteLedger} color={"error"}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteLedgerDialog;
