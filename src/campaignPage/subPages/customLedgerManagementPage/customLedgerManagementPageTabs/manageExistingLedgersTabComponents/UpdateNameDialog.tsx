import React from "react";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import Events from "../../../../../utils/helperMethods/events";
import ErrorCodeExtractor from "../../../../../utils/helperMethods/error-code-extractor";
import CustomStatusCode from "../../../../../utils/constantsAndStaticObjects/custom-status-code";

interface UpdateNameDialogProps {
    open: boolean;
    onClose: () => void;
    customLedger: CustomVotersLedger;
    campaignGuid: string;
}

function UpdateNameDialog(props: UpdateNameDialogProps): JSX.Element {

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
            props.onClose();
        }).catch((error) => {
            const errorCode = ErrorCodeExtractor(error.response.data);
            if (errorCode === CustomStatusCode.LedgerNotFound){
                Events.dispatch(Events.EventNames.BubbleErrorUpwards, "Ledger not found" +
                    " - it may have been deleted by another user. Please try refreshing the page.");
            } else if (errorCode === CustomStatusCode.CampaignNotFound){
                Events.dispatch(Events.EventNames.BubbleErrorUpwards, "Campaign not found" +
                    " - it may have been deleted by another user. Please try refreshing the page.");
            }
            props.onClose();
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
