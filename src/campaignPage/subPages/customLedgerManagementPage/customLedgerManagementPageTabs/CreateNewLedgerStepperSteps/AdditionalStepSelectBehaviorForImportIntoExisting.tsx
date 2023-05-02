import React from "react";
import {Checkbox, FormControl, FormControlLabel, Stack, Typography} from "@mui/material";

interface SixthStepSelectBehaviorForImportIntoExistingProps {
    shouldDeleteOnUnmatch: boolean;
    setShouldDeleteOnUnmatch: (shouldDeleteOnUnmatch: boolean) => void;
}

function AdditionalStepSelectBehaviorForImportIntoExisting(props:
    SixthStepSelectBehaviorForImportIntoExistingProps): JSX.Element {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setShouldDeleteOnUnmatch(event.target.checked);
    };

    return (
        <Stack direction={"column"} spacing={3}>
            <Typography variant={"body1"}>
                If a row in the existing ledger does not match any row in the imported ledger, what should we do?
                <br/>
                Mark the checkbox below to delete the row from the existing ledger (doing this will remove any existing
                row that has no matching identifier in your uploaded file).
            </Typography>
            <FormControl>
                <FormControlLabel control={<Checkbox onChange={onChange}
                    checked={props.shouldDeleteOnUnmatch}/>} label={"Delete"}/>
            </FormControl>
        </Stack>
    );
}

export default AdditionalStepSelectBehaviorForImportIntoExisting;
