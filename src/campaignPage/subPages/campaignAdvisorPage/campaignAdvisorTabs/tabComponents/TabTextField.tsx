import {TextField} from "@mui/material";
import React from "react";

interface AnalysisTitleFieldProps {
    fieldText?: string | null;
    setFieldText?: React.Dispatch<React.SetStateAction<string>>;
    fieldLabel: string;
    isReadOnly: boolean;
    isMultiline?: boolean;
    isRequired?: boolean;
    inputType?: string;
    maxLength?: number;
}

function TabTextField(props: AnalysisTitleFieldProps): JSX.Element {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (props.setFieldText !== undefined) {
            props.setFieldText(event.target.value);
        }
    };

    return (
        <TextField label={props.fieldLabel} variant={"outlined"} multiline={props.isMultiline === true} fullWidth
            required={props.isRequired === true} type={props.inputType ?? "text"}
            value={props.fieldText ?? ""} onChange={onChange} inputProps={{
                readOnly: props.isReadOnly,
                maxLength: props.maxLength !== undefined? props.maxLength : 1000
            }}
        />
    );
}

export default TabTextField;
