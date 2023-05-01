import React, {useEffect} from "react";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";

interface SecondStepSelectExistingLedgerProps {
    customLedgers: CustomVotersLedger[];
    setLedger: (ledger: CustomVotersLedger) => void;
    ledger: CustomVotersLedger;
    shouldDisplayError: boolean;
    setShouldDisplayError: (shouldDisplayError: boolean) => void;
    shouldCheckForError: React.MutableRefObject<boolean>;
}

function SecondStepSelectExistingLedger(props: SecondStepSelectExistingLedgerProps): JSX.Element {

    const onChange = (event: SelectChangeEvent<HTMLInputElement>) => {
        props.setShouldDisplayError(false);
        const ledger = props.customLedgers.find((lgr) => lgr.ledgerGuid === event.target.value);
        // This should only ever be undefined if the user selects the "None" option.
        if (ledger === undefined) {
            // Create a blank ledger, which will be used to indicate that the user has not selected a ledger.
            props.setLedger({} as CustomVotersLedger);
            return;
        }
        props.setLedger(ledger);
    };

    useEffect(() => {
        props.shouldCheckForError.current = true;
        props.setLedger({} as CustomVotersLedger);
        return () => {
            props.shouldCheckForError.current = false;
            props.setShouldDisplayError(false);
        };
    }, []);

    return (
        <Stack direction={"column"} spacing={5} sx={{
            marginTop: "2rem",
        }}>
            <Typography variant={"body1"}>
                Choose which ledger you would like to import into:
            </Typography>
            <FormControl sx={{
                width: "40%"
            }}>
                <InputLabel id={"select-ledger-label"}>Select ledger</InputLabel>
                <Select
                    labelId={"select-ledger-label"}
                    onChange={onChange}
                    label={"Select ledger"}
                    // This is a bit of a hack, but it works. The value of the select is the ledgerGuid of the ledger,
                    // and the conversion is done because value must, for whatever reason, be "" | HTMLInputElement |
                    // undefined. The ledgerGuid is a string, so it must be converted to unknown, then to undefined.
                    value={(props.customLedgers.find((lgr) =>
                        lgr.ledgerGuid === props.ledger.ledgerGuid)?.ledgerGuid ?? "") as unknown as undefined}
                    error={props.shouldDisplayError}
                >
                    <MenuItem value={""}><em>None</em></MenuItem>
                    {props.customLedgers.map((ledger, index) => {
                        return (
                            <MenuItem key={index} value={ledger.ledgerGuid?? ""}>{ledger.ledgerName}</MenuItem>
                        );
                    })}
                </Select>
                {props.shouldDisplayError && <FormHelperText>Please select a value to proceed</FormHelperText>}
            </FormControl>
        </Stack>
    );
}

export default SecondStepSelectExistingLedger;
