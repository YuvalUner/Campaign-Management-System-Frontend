import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function BallotNumberField(props: VotersLedgerFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.filterParams.current.ballotId = parseInt(event.target.value);
    };

    return (
        <FormControl fullWidth={true}>
            <TextField type={"number"} label={"Ballot number"} value={props.filterParams.current.ballotId}
                onChange={handleChange}
            />
        </FormControl>
    );
}

export default BallotNumberField;
