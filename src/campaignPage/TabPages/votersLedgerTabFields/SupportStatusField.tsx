import React from "react";
import VotersLedgerFieldProps from "./utils/voters-ledger-field-props";
import {Checkbox, FormControl, FormControlLabel, FormGroup, Tooltip, Typography} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function SupportStatusField(props: VotersLedgerFieldProps): JSX.Element {

    const [checkboxesChecked, setCheckboxesChecked] = React.useState<boolean[]>([false, false]);
    const checkboxNames = {
        supporting: "supporting",
        notSupporting: "not supporting",
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name} = event.target;
        let definedSupportStatus: boolean | null = null;
        // If the first checkbox is checked, then the second one is unchecked and vice versa
        if (name === checkboxNames.supporting) {
            // Store the value of the checkbox that was checked
            definedSupportStatus = !checkboxesChecked[0];
            setCheckboxesChecked([!checkboxesChecked[0], false]);
            // If it was checked, set the support status to a value. Else, keep it null.
            if (definedSupportStatus){
                props.filterParams.current.supportStatus = true;
            } else{
                props.filterParams.current.supportStatus = null;
            }
        } else if (name === checkboxNames.notSupporting) {
            definedSupportStatus = !checkboxesChecked[1];
            setCheckboxesChecked([false, !checkboxesChecked[1]]);
            if (definedSupportStatus){
                props.filterParams.current.supportStatus = false;
            } else{
                props.filterParams.current.supportStatus = null;
            }
        }
    };

    return (
        <FormControl fullWidth>
            <Typography variant={"body1"}>
                Support Status
                <Tooltip sx={{
                    marginLeft: "0.5rem",
                }} title={"Uncheck the boxes to remove the search criteria"}>
                    <ErrorOutlineIcon color={"primary"}/>
                </Tooltip>
            </Typography>
            <FormGroup row={true}>
                <FormControlLabel control={
                    <Checkbox name={checkboxNames.supporting} checked={checkboxesChecked[0]} onChange={onChange}/>
                } label={"Supporting"}/>
                <FormControlLabel control={
                    <Checkbox name={checkboxNames.notSupporting} checked={checkboxesChecked[1]} onChange={onChange}/>
                } label={"Not supporting"}/>
            </FormGroup>
        </FormControl>
    );
}

export default SupportStatusField;
