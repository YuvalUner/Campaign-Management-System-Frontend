import React from "react";
import {TextField} from "@mui/material";
import "../ProfilePage";

interface Props {
    showAlert: (message: string, severity: "error" | "warning" | "info" | "success") => void;
    userDetails: {
        lastNameHeb: string;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

export const LastNameField = ({showAlert, userDetails, handleInputChange}: Props) => {
    return (
        <label>
            <TextField
                className="input-field"
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                type="text"
                name="lastNameHeb"
                value={userDetails.lastNameHeb}
                onChange={handleInputChange}
            />
        </label>
    );
};
export default LastNameField;
