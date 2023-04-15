import React, { useEffect, useState } from "react";
import UserPrivateInfo from "../models/user-private-info";
import config from "../app-config.json";
import { AxiosResponse, HttpStatusCode } from "axios";
import ErrorCodeExtractor from "../utils/error-code-extractor";
import {
    Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    List, DialogTitle, Divider, FormControl, InputLabel,
    ListItem,
    ListItemText,
    MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, makeStyles
} from "@mui/material";
import ServerRequestMaker from "../utils/server-request-maker";
import CustomStatusCode from "../utils/constantsAndStaticObjects/custom-status-code";

function ProfilePage(): JSX.Element {
    // Define state object to store user's personal details
    const [userDetails, setUserDetails] = useState<UserPrivateInfo>({
        firstNameHeb: "",
        lastNameHeb: "",
        idNumber: 0,
        cityName: "",
        phoneNum: "",
    });

    const [isVerified, setIsVerified] = useState(false);

    // Define a state variable to track whether the form has been submitted
    const [submitted, setSubmitted] = useState(false);
    //set Alert definition
    const [alertMessage, setAlertMessage] = useState<React.ReactNode>(null);

    const [cities, setCities] = useState([{ cityId: 10, cityName: "תירוש" }]);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetVerifiedStatus
        ).then((res: AxiosResponse) => {
            setIsVerified(res.data.isVerified === true);
            // setIsVerified(true);
        });
    }, []);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetProfilePageInfo
        ).then((res: AxiosResponse) => {
            const updatedUserDetails = {
                firstNameHeb: res.data.firstNameHeb,
                lastNameHeb: res.data.lastNameHeb,
                idNumber: 0,
                cityName: res.data.cityName,
                phoneNum: res.data.phoneNumber
            };
            if (isVerified) {
                setUserDetails(updatedUserDetails);
            }
        });
    }, [isVerified]);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Cities.Base
        ).then((res: AxiosResponse) => {
            setCities(res.data);
        });
    }, []);

    //Define a show alert function
    const showAlert = (message: string, severity: "error" | "warning" | "info" | "success") => {
        setAlertMessage(
            <Alert variant="outlined" severity={severity} onClose={() => setAlertMessage(null)}>
                <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
                <strong>{message}</strong>
            </Alert>
        );
    };
    // Define a function to handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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


        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.UserPrivateInfo,
            userDetails
        );

        if (res.status === HttpStatusCode.Ok) {
            showAlert("User private info updated successfully!", "success");
            setIsVerified(true);
            setSubmitted(true);
        } else {
            const errNum = ErrorCodeExtractor(res.data);
            if (res.status !== HttpStatusCode.Unauthorized) {
                if (errNum === CustomStatusCode.DuplicateKey) {
                    showAlert("ID number already exists when verifying info.", "error");
                } else if (errNum === CustomStatusCode.AlreadyVerified) {
                    showAlert("Phone number already verified.", "error");
                } else {
                    showAlert("Unauthorized request.", "error");
                }
            } else {
                if (errNum === CustomStatusCode.ValueNotFound) {
                    showAlert("Verification failed. Please check your info and try again.", "error");
                } else if (errNum === CustomStatusCode.DuplicateKey) {
                    showAlert("ID number already exists when verifying info.", "error");
                } else {
                    showAlert("Bad request.", "error");
                }
            }
        }
    };

    // Define a function to handle changes in the input fields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCityChange = (event: SelectChangeEvent<HTMLSelectElement>) => {
        const cityName = event.target.value as string;
        //const cityName = cities.find(city => city.cityId === value)?.cityName || "";
        setUserDetails((prevState) => ({
            ...prevState,
            cityName: cityName
        }));
    };

    const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        return;
    };

    //handling phone number change pop-up
    const [open, setOpen] = useState(false);

    const [inputValue, setInputValue] = useState("");

    const handleDialog = () => {
        setOpen(!open);
    };

    const handleDialogChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const styles = {
        halfWidth: {
            width: "50%",
        },
        listItem: {
            backgroundColor: "white",
            "&:hover": {
                backgroundColor: "lightgray",
            },
        },
    };

    return (
        <div>
            <Typography variant={"h4"}>
                Profile Page
            </Typography>
            {isVerified ? (
                <div>
                    <Stack onSubmit={handleUpdate}>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem sx={styles.listItem} style={styles.halfWidth}>
                                <ListItemText primary="Name:"/> {userDetails.firstNameHeb}
                            </ListItem>
                            <Divider />
                            <ListItem sx={styles.listItem} divider style={styles.halfWidth}>
                                <ListItemText primary="Surname:" /> {userDetails.lastNameHeb}
                            </ListItem>
                            <ListItem sx={styles.listItem} style={styles.halfWidth}>
                                <ListItemText primary="Phone Number:" /> {userDetails.phoneNum}
                            </ListItem>
                            <Divider light />
                            <ListItem>
                                <Button onClick={handleDialog} style={styles.halfWidth} 
                                    type="submit" id="outlined-basic"
                                    variant="contained" color="inherit">Update Number</Button>
                            </ListItem>
                        </List>
                    </Stack>
                    <Dialog open={open} onClose={handleDialog}>
                        <DialogTitle>Update phone number</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="New Number"
                                    type="text"
                                    value={inputValue}
                                    onChange={handleDialogChange}
                                    fullWidth
                                />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialog}>Close</Button>
                            <Button onClick={handleDialog}>Update</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            ) : (
                // If the form hasn't been submitted yet, display the form for the user to enter their personal details
                <>  
                    <form onSubmit={handleSubmit}>
                        <Stack direction={"column"} spacing={1}>
                            {alertMessage}
                            <label>
                                {/* <FirstNameField showAlert={showAlert} /> */}
                                <TextField id="outlined-basic" label="First Name" variant="outlined"
                                    type="text"
                                    name="firstNameHeb"
                                    value={userDetails.firstNameHeb}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <TextField id="outlined-basic" label="Last Name" variant="outlined"
                                    type="text"
                                    name="lastNameHeb"
                                    value={userDetails.lastNameHeb}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <TextField id="outlined-basic" label="ID" variant="outlined"
                                    type="text"
                                    name="idNumber"
                                    value={userDetails.idNumber}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <p><FormControl style={styles.halfWidth}>
                                    <InputLabel id="demo-simple-select-label" variant="outlined">City</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="City"
                                        onChange={handleCityChange} native>
                                        <option value=""/>
                                        {cities.map(city => {
                                            return <option key={city.cityId} value={city.cityName}>
                                                {city.cityName}
                                            </option>;
                                        }
                                        )
                                        }
                                    </Select>
                                </FormControl>
                                </p>
                            </label>
                            <Button style={styles.halfWidth} type="submit" id="outlined-basic"
                                variant="contained" color="inherit">Submit</Button>
                        </Stack>
                    </form>
                </>
            )}
        </div>
    );
}

export default ProfilePage;
