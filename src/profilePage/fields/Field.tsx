import React from "react";
import {TextField} from "@mui/material";
import "../ProfilePage";

interface FieldProps {
    label: string;
    value: string;
    type?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    disabled?: boolean;
    endAdornment?:any;
}

export const Field = (props: FieldProps) => {
    return (
        <>
            <TextField
                label={props.label}
                variant={(props.value !== "") ? "outlined" : "filled"}
                type={props.type ?? "text"}
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                InputProps={{
                    readOnly: true,
                    endAdornment:props.endAdornment,
                }}
                disabled={props.disabled ?? (props.value === "")}
                style={{width: 250}}
            />

        </>
    );
};
export default Field;
