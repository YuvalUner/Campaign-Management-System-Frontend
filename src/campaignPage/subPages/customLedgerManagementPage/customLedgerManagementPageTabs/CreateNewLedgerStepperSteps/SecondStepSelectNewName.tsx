import React from "react";
import {Alert, FormControl, Stack, TextField, Typography} from "@mui/material";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import Events from "../../../../../utils/helperMethods/events";

interface SecondStepSelectNewNameProps {
    customLedgers: CustomVotersLedger[];
    ledger: CustomVotersLedger;
    setLedger: (ledger: CustomVotersLedger) => void;
}

function SecondStepSelectNewName(props: SecondStepSelectNewNameProps): JSX.Element {

    const [displayWarning, setDisplayWarning] = React.useState<boolean>(false);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ledger = props.ledger;
        ledger.ledgerName = event.target.value;
        props.setLedger(ledger);
        if (props.customLedgers.some((lgr) => lgr.ledgerName?.toLowerCase()
            === event.target.value?.toLowerCase())) {
            setDisplayWarning(true);
            Events.dispatch(Events.EventNames.ShouldRaisePrompt);
        } else {
            setDisplayWarning(false);
        }
    };

    return (
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
    );
}


export default SecondStepSelectNewName;
