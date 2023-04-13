import React from "react";
import {FormControl, TextField} from "@mui/material";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";

function StreetNameField(props: VotersLedgerFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.filterParams.current.streetName = event.target.value;
    };

    return (
        <FormControl fullWidth>
            <TextField type={"text"} fullWidth={true} label={"Street Name"} onChange={handleChange}/>
        </FormControl>
    );
}

export default StreetNameField;
