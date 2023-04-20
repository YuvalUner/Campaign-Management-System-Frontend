import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function LastNameField(props: VotersLedgerFieldProps): JSX.Element {


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") {
            props.filterParams.current.lastName = null;
            return;
        }
        props.filterParams.current.lastName = event.target.value;
    };

    return (
        <FormControl fullWidth>
            <TextField type={"text"} fullWidth={true} label={"Last Name"} onChange={handleChange}/>
        </FormControl>
    );
}

export default LastNameField;
