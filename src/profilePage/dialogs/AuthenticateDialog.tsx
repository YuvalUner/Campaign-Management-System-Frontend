import React, {forwardRef, SyntheticEvent, useState} from "react";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ServerRequestMaker from "../../utils/helperMethods/server-request-maker";
import config from "../../app-config.json";
import {HttpStatusCode} from "axios";
import ErrorCodeExtractor from "../../utils/helperMethods/error-code-extractor";
import CustomStatusCode from "../../utils/constantsAndStaticObjects/custom-status-code";
import City from "../../models/city";
import User from "../../models/user";

interface AuthenticateFormProps {
    switchMode: () => void;
    isOpen: boolean;
    userDetails: User;
    cities: City[];
    fetch: () => Promise<void>;
}

export const AuthenticateDialog = forwardRef<HTMLDivElement, AuthenticateFormProps>((props, ref) => {
    // set Alert definition
    const [alertMessage, setAlertMessage] = useState<React.ReactNode>(null);
    const [userDetails, setUserDetails] = useState<User>({...props.userDetails});


    const showAlert = (message: string, severity: "error" | "warning" | "info" | "success") => {
        setAlertMessage(
            <Alert variant="outlined" severity={severity} onClose={() => setAlertMessage(null)}>
                <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
                <strong>{message}</strong>
            </Alert>,
        );
    };

    // a function that will be called when pressing submit
    // it needs to:
    // (1) check input
    // (2) send new date
    // (3) check server returned ok
    // (3.1) if not show error message
    const handleSubmit = async () => {
        // checking input
        if (!userDetails.firstNameHeb || !userDetails.lastNameHeb || !userDetails.idNumber || !userDetails.cityName) {
            showAlert("Please fill in all fields", "error");
            return;
        }
        if (!/^[\u0590-\u05FF]+$/.test(userDetails.firstNameHeb)) {
            showAlert("First name should contain only Hebrew letters", "error");
            return;
        }

        if (!/^[\u0590-\u05FF]+$/.test(userDetails.lastNameHeb)) {
            showAlert("Last name should contain only Hebrew letters", "error");
            return;
        }
        if (userDetails.idNumber.toString().length !== 9) {
            showAlert("ID number must be exactly 9 digits", "error");
            return;
        }

        // put new data in server
        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.UserPrivateInfo,
            userDetails,
        );

        // if server returned ok then finish - showing at alert success, setting isVerified and submitted
        // TODO: check why setting setIsVerified and setSubmitted
        // TODO: change name and meaning of alert - alert should not be positive (success)
        if (res.status === HttpStatusCode.Ok) {
            // showAlert("User private info updated successfully!", "success");
            props.fetch();
            props.switchMode();
            return;
        }

        // if returned notOK then show failure
        const errNum = ErrorCodeExtractor(res.data);
        if (res.status !== HttpStatusCode.Unauthorized) {
            if (errNum === CustomStatusCode.DuplicateKey) {
                showAlert("ID number already exists when verifying info.", "error");
            } else if (errNum === CustomStatusCode.AlreadyVerified) {
                showAlert("Phone number already verified.", "error");
            } else {
                showAlert("Unauthorized request.", "error");
            }
        } else if (errNum === CustomStatusCode.ValueNotFound) {
            showAlert("Verification failed. Please check your info and try again.", "error");
        } else if (errNum === CustomStatusCode.DuplicateKey) {
            showAlert("ID number already exists when verifying info.", "error");
        } else {
            showAlert("Bad request.", "error");
        }
    };

    // defining function that will be called when input is changed that will change the field in the info
    // TODO: this will cause render whenever input is changed, should switch to useRef, and on submit getting the info
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // TODO: same as above
    const handleCityChange = (event: SyntheticEvent<Element, Event>, value: City | null) => {
        setUserDetails((prevState) => ({
            ...prevState,
            cityName: value?.cityName,
        }));
    };
    return (
        <>
            <Dialog open={props.isOpen} fullWidth maxWidth={"sm"} onClose={props.switchMode}>
                <DialogContent>
                    <DialogTitle justifyContent={"center"} alignItems="center">
                        <Stack justifyContent="center" display="flex" alignItems="center">
                            <Avatar src={userDetails.profilePicUrl ?? ""} alt={userDetails.displayNameEng} sx={{
                                height: "112px",
                                width: "112px",
                            }}/>
                            <Typography variant={"h6"}>Personal details</Typography>
                        </Stack>
                    </DialogTitle>
                    <Stack spacing={4} justifyContent="center" alignItems="center">
                        <TextField label={"ID"} name={"idNumber"} value={userDetails.idNumber ?? ""}
                            onChange={handleInputChange} sx={{width: "75%"}}/>
                        <TextField label={"First Name In Hebrew"} name={"firstNameHeb"}
                            value={userDetails.firstNameHeb ?? ""}
                            onChange={handleInputChange} sx={{width: "75%"}}/>
                        <TextField label={"Last Name In Hebrew"} name={"lastNameHeb"}
                            value={userDetails.lastNameHeb ?? ""}
                            onChange={handleInputChange} sx={{width: "75%"}}/>
                        <Autocomplete
                            disablePortal
                            options={props.cities}
                            getOptionLabel={(option) => option.cityName}
                            renderOption={(param, option) => <Box component="li" sx={{
                                "& > img": {
                                    mr: 2,
                                    flexShrink: 0,
                                },
                            }} {...param}>{option.cityName}</Box>}
                            renderInput={(params) => (
                                <TextField {...params} label="City"/>
                            )}
                            sx={{width: "75%"}}
                            onChange={handleCityChange}
                        />
                        {alertMessage}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box>
                        <Button onClick={props.switchMode}>Close</Button>
                        <Button onClick={handleSubmit}>Update</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>

    );
});

AuthenticateDialog.displayName = "Search";
