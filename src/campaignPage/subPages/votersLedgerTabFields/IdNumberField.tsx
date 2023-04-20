import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function IdNumberField(props: VotersLedgerFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") {
            props.filterParams.current.idNum = null;
            return;
        }
        props.filterParams.current.idNum = parseInt(event.target.value);
    };

    return (
        <FormControl fullWidth={true}>
            <TextField type={"number"} label={"Id Number"} onChange={handleChange}/>
        </FormControl>
    );
}

export default IdNumberField;
