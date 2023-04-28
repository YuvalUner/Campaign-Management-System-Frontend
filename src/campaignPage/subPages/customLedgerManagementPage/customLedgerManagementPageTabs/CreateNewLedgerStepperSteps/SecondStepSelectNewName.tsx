import React, {useEffect} from "react";
import {
    Alert, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import Events from "../../../../../utils/helperMethods/events";

interface SecondStepSelectNewNameProps {
    customLedgers: CustomVotersLedger[];
    ledger: CustomVotersLedger;
    setLedger: (ledger: CustomVotersLedger) => void;
    setShouldRaisePrompt: (shouldRaisePrompt: boolean) => void;
}

function SecondStepSelectNewName(props: SecondStepSelectNewNameProps): JSX.Element {

    const [displayWarning, setDisplayWarning] = React.useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ledger = props.ledger;
        ledger.ledgerName = event.target.value;
        props.setLedger(ledger);
        if (props.customLedgers.some((lgr) => lgr.ledgerName?.toLowerCase()
            === event.target.value?.toLowerCase())) {
            setDisplayWarning(true);
            props.setShouldRaisePrompt(true);
        } else {
            setDisplayWarning(false);
            props.setShouldRaisePrompt(false);
        }
    };

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.RaisePrompt, openDialog);
        return () => {
            Events.unsubscribe(Events.EventNames.RaisePrompt, openDialog);
        };
    }, []);


    const onAccept = () => {
        props.setShouldRaisePrompt(false);
        Events.dispatch(Events.EventNames.GoForward);
        closeDialog();
    };

    return (
        <>
            <Stack direction={"column"} spacing={5} sx={{
                marginTop: "2rem",
            }}>
                <Typography variant={"body1"}>
                    Choose a name for your new ledger:
                </Typography>
                <FormControl sx={{
                    width: "40%"
                }}>
                    <TextField label={"Ledger name"} variant={"outlined"} onChange={onChange}/>
                    {displayWarning && <Alert severity={"warning"}>You already have a ledger with this name.</Alert>}
                </FormControl>
            </Stack>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Update ledger name</DialogTitle>
                <DialogContent>
                    <Typography variant={"body1"}>
                        You already have a ledger with the name
                        <b>{" " + props.ledger.ledgerName}</b>, Are you sure you want to create another one with the
                        same name?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Change name</Button>
                    <Button onClick={onAccept} color={"warning"}>I&apos;m sure</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


export default SecondStepSelectNewName;
