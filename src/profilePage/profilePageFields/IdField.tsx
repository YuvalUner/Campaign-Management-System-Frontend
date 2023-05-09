import React from "react";
import {TextField} from "@mui/material";
import "../ProfilePage";

interface Props {
    showAlert: (message: string, severity: "error" | "warning" | "info" | "success") => void;
    userDetails: {
        idNumber: number;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

export const IdField = ({showAlert, userDetails, handleInputChange}: Props) => {
    return (
        <label>
            <TextField
                className="input-field"
                id="outlined-basic"
                label="ID"
                variant="outlined"
                type="text"
                name="idNumber"
                value={userDetails.idNumber}
                onChange={handleInputChange}
            />
        </label>
    );
};
export default IdField;
