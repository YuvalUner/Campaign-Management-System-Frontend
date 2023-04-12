import React, {useEffect, useState} from "react";
import UserPrivateInfo from "../models/user-private-info";
import config from "../app-config.json";
import {AxiosResponse, HttpStatusCode} from "axios";
import ErrorCodeExtractor from "../utils/error-code-extractor";
import {Alert, AlertTitle, FormControl, InputLabel,
    MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material"; 
import ServerRequestMaker from "../utils/server-request-maker";
//import { Alert, AlertTitle } from "react-bootstrap"; // For Bootstrap

function ProfilePage(): JSX.Element {
    // Define state object to store user's personal details
    const [userDetails, setUserDetails] = useState<UserPrivateInfo>({
        firstNameHeb: "",
        lastNameHeb: "",
        idNumber: 0,
        cityName: "",
    });

    const [isVerified, setIsVerified] = useState(false);

    // Define a state variable to track whether the form has been submitted
    const [submitted, setSubmitted] = useState(false);
    //set Alert definition
    const [alertMessage, setAlertMessage] = useState<React.ReactNode>(null);

    const [cities, setCities] = useState([{cityId : 1, cityName : "Jerusalem"}]);

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
            };
            if(isVerified) {
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
        // if (userDetails.firstNameHeb.match(/^[\u0590-\u05FF ]+$/) === null) {
        //     showAlert("First name must be in Hebrew letters only", "error");
        //     return;
        // }
        // if (userDetails.lastNameHeb.match(/^[\u0590-\u05FF ]+$/) === null) {
        //     showAlert("Last name must be in Hebrew letters only", "error");
        //     return;
        // }
        if (userDetails.idNumber.toString().length !== 9) {
            showAlert("ID number must be exactly 9 digits", "error");
            return;
        }
        
        
        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.UserPrivateInfo,
            userDetails
        );

        if (res.status === HttpStatusCode.Ok){
            showAlert("User private info updated successfully!", "success");
            setIsVerified(true);
            setSubmitted(true);
        } else{
            const errNum = ErrorCodeExtractor(res.data);
            if (res.status !== HttpStatusCode.Unauthorized) {
                if (errNum === 1) {
                    showAlert("ID number already exists when verifying info.", "error");
                } else if (errNum === 12) {
                    showAlert("Phone number already verified.", "error");
                } else {
                    showAlert("Unauthorized request.", "error");
                }
            } else{
                if (errNum === 4) {
                    showAlert("Verification failed. Please check your info and try again.", "error");
                } else if (errNum === 1) {
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

    const handleCityChange = (event: SelectChangeEvent<number>) => {
        const { value } = event.target;
        const cityName = cities.find(city => city.cityId === value)?.cityName || "";
        console.log(event.target);
        setUserDetails((prevState) => ({
            ...prevState,
            cityName: cityName,
        }));
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {isVerified ? (
                // If the form has been submitted and verified, display the user's personal details in read-only format
                <div>
                    <p>Name: {userDetails.firstNameHeb}</p>
                    <p>Surname: {userDetails.lastNameHeb}</p>

                </div>
            ) : (
                // If the form hasn't been submitted yet, display the form for the user to enter their personal details
                <>
                    {alertMessage}
                    <form onSubmit={handleSubmit}>
                        <label>
                        Name:
                            <TextField
                                type="text"
                                name="firstNameHeb"
                                value={userDetails.firstNameHeb}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                        Last Name:
                            <TextField
                                type="text"
                                name="lastNameHeb"
                                value={userDetails.lastNameHeb}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                        ID:
                            <TextField
                                type="text"
                                name="idNumber"
                                value={userDetails.idNumber}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            <p><FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">City</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={
                                        cities.find(city => city.cityName === userDetails.cityName)?.cityId
                                        || cities[0].cityId
                                    }
                                    label="City"
                                    onChange={handleCityChange}
                                >
                                    {cities.map(city => {
                                        // eslint-disable-next-line max-len
                                        return <MenuItem key={city.cityId} value={city.cityId}>{city.cityName}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl></p>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default ProfilePage;
