import React from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";

function FirstStepChooseAction(): JSX.Element {
    return (
        <>
            <Typography variant={"h6"}>
                Welcome to the custom voters ledger creation menu.
            </Typography>
            <Typography variant={"body1"} sx={{
                marginTop: "1rem",
            }}>
                Follow the steps presented to you to create a new voters ledger to use in your campaign.
                <br/>
                First, choose the action you want to perform:
            </Typography>
            <FormControl sx={{
                marginTop: "1rem",
            }}>
                <FormLabel>Choose action</FormLabel>
                <RadioGroup
                    defaultValue={"create+import"}
                >
                    <FormControlLabel value={"create+import"}
                        control={<Radio/>} label={"Create and import new ledger from file"}/>
                    <FormControlLabel value={"existing"} control={<Radio/>} label={"Import file into existing ledger"}/>
                    <FormControlLabel value={"create"}
                        control={<Radio/>} label={"Create new ledger without importing"}/>
                </RadioGroup>
            </FormControl>
        </>
    );
}

export default FirstStepChooseAction;
