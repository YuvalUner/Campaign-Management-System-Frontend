import React from "react";
import {TextField} from "@mui/material";
import "../ProfilePage";

interface Props {
    showAlert: (message: string, severity: "error" | "warning" | "info" | "success") => void;
    userDetails: {
      firstNameHeb: string;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

export const FirstNameField = ({showAlert, userDetails, handleInputChange}: Props) => {
    return (
        <label>
            <TextField
                className="input-field"
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                type="text"
                name="firstNameHeb"
                value={userDetails.firstNameHeb}
                onChange={handleInputChange}
            />
        </label>
    );
};
export default FirstNameField;
