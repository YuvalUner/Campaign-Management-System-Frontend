import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import user from "../../models/campaign";
import UserPrivateInfo from "../../models/user-private-info";

interface FirstNameFieldProps {
        showAlert: (message: string, severity: "error" | "warning" | "info" | "success") => void;
      }

function FirstNameField(props: FirstNameFieldProps): JSX.Element {
    const [userDetails, setUserDetails] = useState<UserPrivateInfo>({
        firstNameHeb: "",
        lastNameHeb: "",
        idNumber: 0,
        cityName: "",
    });
// Define a function to handle changes in the input fields
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({
        ...prevState,
        [name]: value,
    }));
};
    return(
        <TextField id="outlined-basic" label="First Name" variant="outlined"
                                type="text"
                                name="firstNameHeb"
                                //value={userDetails.firstNameHeb}
                                onChange={handleInputChange}
                            />
    )
}
export default FirstNameField;

