/*
eslint no-shadow: "off",
no-unused-vars: "off",
 */

import React from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";

export enum FirstStepChooseActionEnum {
    CreateAndImport = "create+import",
    Existing = "existing",
    Create = "create",
}

interface FirstStepChooseActionProps {
    chosenAction: FirstStepChooseActionEnum;
    setChosenAction: (action: FirstStepChooseActionEnum) => void;
}

function FirstStepChooseAction(props: FirstStepChooseActionProps): JSX.Element {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setChosenAction(event.target.value as FirstStepChooseActionEnum);
    };

    return (
        <>
            <Typography variant={"h6"}>
                Welcome to the custom voters ledger creation page.
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
                    value={props.chosenAction}
                    onChange={onChange}
                    name={"choose-action"}
                >
                    <FormControlLabel value={FirstStepChooseActionEnum.CreateAndImport}
                        control={<Radio/>} label={"Create and import new ledger from file"}/>
                    <FormControlLabel value={FirstStepChooseActionEnum.Existing}
                        control={<Radio/>} label={"Import file into existing ledger"}/>
                    <FormControlLabel value={FirstStepChooseActionEnum.Create}
                        control={<Radio/>} label={"Create new ledger without importing"}/>
                </RadioGroup>
            </FormControl>
        </>
    );
}

export default FirstStepChooseAction;
