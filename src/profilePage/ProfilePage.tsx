import React, {useEffect, useState} from "react";
import UserPrivateInfo from "../models/user-private-info";
import config from "../app-config.json";
import {AxiosResponse, HttpStatusCode} from "axios";
import ErrorCodeExtractor from "../utils/helperMethods/error-code-extractor";
import {
    Alert, AlertTitle, Button,
    List, Divider,
    ListItem,
    ListItemText,
    SelectChangeEvent, Stack, Typography, Box,
} from "@mui/material";
import ServerRequestMaker from "../utils/helperMethods/server-request-maker";
import CustomStatusCode from "../utils/constantsAndStaticObjects/custom-status-code";
import UpdateNumberDialog from "./UpdateNumberDialog";
import FirstNameField from "./profilePageFields/FirstNameField";
import LastNameField from "./profilePageFields/LastNameField";
import IdField from "./profilePageFields/IdField";
import CityField from "./profilePageFields/CityField";
import "./ProfilePage.css";

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

    const [cities, setCities] = useState([{cityId: 10, cityName: "תירוש"}]);

    // holds if dialog (whatever it is) is open
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    // TODO: refactor this useEffect as async function
    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetVerifiedStatus,
        ).then((res: AxiosResponse) => {
            // TODO: isVerified is probably should be IsVerified
            setIsVerified(res.data.isVerified === true);
        });
    }, []);

    // TODO: move this useEffect to be .then (or better async function) in the above useEffect
    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetProfilePageInfo,
        ).then((res: AxiosResponse) => {
            const updatedUserDetails = {
                firstNameHeb: res.data.firstNameHeb,
                lastNameHeb: res.data.lastNameHeb,
                idNumber: 0,
                cityName: res.data.cityName,
                phoneNum: res.data.phoneNumber,
            };
            if (isVerified) {
                setUserDetails(updatedUserDetails);
            }
        });
    }, [isVerified, isDialogOpen]);

    // gets the cities, probably the list that is being shown
    // TODO: add it to the useEffect above as a parallel async.
    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Cities.Base,
        ).then((res: AxiosResponse) => {
            setCities(res.data);
        });
    }, []);

    // function to show alert message
    // TODO: refactor it to different component, and not save it to state - change the state to hold the message and
    //  create the message in return value
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
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
            showAlert("User private info updated successfully!", "success");
            setIsVerified(true);
            setSubmitted(true);
        } else {
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
    const handleCityChange = (event: SelectChangeEvent<HTMLSelectElement>) => {
        const cityName = event.target.value as string;
        //const cityName = cities.find(city => city.cityId === value)?.cityName || "";
        setUserDetails((prevState) => ({
            ...prevState,
            cityName: cityName,
        }));
    };

    // TODO: this is provably to remove the default behavior of submit, there is cleaner way (think), need to look it up
    //  in minimum use lambda ()=>{} or leave it empty
    const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        return;
    };


    const switchDialogMode = () => {
        setIsDialogOpen((prev) => !prev);
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
                    {/* data part*/}
                    <Stack onSubmit={handleUpdate}>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem sx={styles.listItem} style={styles.halfWidth}>
                                <ListItemText primary="Name:"/> {userDetails.firstNameHeb}
                            </ListItem>
                            <Divider/>
                            <ListItem sx={styles.listItem} divider style={styles.halfWidth}>
                                <ListItemText primary="Surname:"/> {userDetails.lastNameHeb}
                            </ListItem>
                            <ListItem sx={styles.listItem} style={styles.halfWidth}>
                                <ListItemText primary="Phone Number:"/> {userDetails.phoneNum}
                            </ListItem>
                            <Divider light/>
                            <ListItem>
                                <Button onClick={switchDialogMode} style={styles.halfWidth}
                                    type="submit" id="outlined-basic"
                                    variant="contained" color="inherit">Update Number</Button>
                            </ListItem>
                        </List>
                    </Stack>
                    {/*pop up*/}
                    <UpdateNumberDialog isOpen={isDialogOpen} switchMode={switchDialogMode}/>
                </div>
            ) : (
                // If the form hasn't been submitted yet, display the form for the user to enter their personal details
                <>
                    <Box className="container">
                        <Box className="form-container">
                            <form onSubmit={handleSubmit}>
                                <Stack direction={"column"} spacing={1}>
                                    {alertMessage}
                                    <FirstNameField
                                        showAlert={showAlert}
                                        userDetails={userDetails}
                                        handleInputChange={handleInputChange}
                                    />
                                    <LastNameField
                                        showAlert={showAlert}
                                        userDetails={userDetails}
                                        handleInputChange={handleInputChange}
                                    />
                                    <IdField
                                        showAlert={showAlert}
                                        userDetails={userDetails}
                                        handleInputChange={handleInputChange}
                                    />
                                    <CityField handleCityChange={handleCityChange} cities={cities} />
                                    <Button className="submit-button" type="submit" id="outlined-basic"
                                        variant="contained" color="inherit">Submit</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </>
            )}
        </div>
    );
}

export default ProfilePage;
