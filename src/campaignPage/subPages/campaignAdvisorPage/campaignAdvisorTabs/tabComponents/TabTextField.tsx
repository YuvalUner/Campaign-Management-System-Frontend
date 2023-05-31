import {TextField} from "@mui/material";
import React from "react";

interface AnalysisTitleFieldProps {
    fieldText?: string | null;
    setFieldText?: React.Dispatch<React.SetStateAction<string>>;
    fieldLabel: string;
    isReadOnly: boolean;
    isMultiline?: boolean;
}

function TabTextField(props: AnalysisTitleFieldProps): JSX.Element {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (props.setFieldText !== undefined) {
            props.setFieldText(event.target.value);
        }
    };

    return (
        <TextField label={props.fieldLabel} variant={"outlined"} multiline={props.isMultiline === true}
            value={props.fieldText ?? ""} onChange={onChange} inputProps={{
                readOnly: props.isReadOnly
            }}
        />
    );
}

export default TabTextField;
