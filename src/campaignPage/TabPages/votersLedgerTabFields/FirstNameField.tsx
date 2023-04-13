import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function FirstNameField(props: VotersLedgerFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.filterParams.current.firstName = event.target.value;
    };

    return (
        <FormControl fullWidth>
            <TextField type={"text"} label={"First name"} onChange={handleChange}/>
        </FormControl>
    );
}

export default FirstNameField;
