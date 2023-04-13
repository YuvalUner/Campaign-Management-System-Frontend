import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function BallotNumberField(props: VotersLedgerFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") {
            props.filterParams.current.ballotId = null;
            return;
        }
        props.filterParams.current.ballotId = parseFloat(event.target.value);
    };

    return (
        <FormControl fullWidth={true}>
            <TextField type={"number"} inputProps={{
                step: 0.1,
            }} label={"Ballot number"} onChange={handleChange}/>
        </FormControl>
    );
}

export default BallotNumberField;
