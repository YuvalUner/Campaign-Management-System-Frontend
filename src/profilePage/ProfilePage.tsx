import React, {useEffect, useState} from "react";
import config from "../app-config.json";
import {Avatar, Box, Divider, Paper, Stack, Typography} from "@mui/material";
import ServerRequestMaker from "../utils/helperMethods/server-request-maker";
import "./ProfilePage.css";
import City from "../models/city";
import User from "../models/user";
import UpdateNumberDialog from "./dialogs/UpdateNumberDialog";
import Field from "./fields/Field";
import Constants from "../utils/constantsAndStaticObjects/constants";
import Button from "@mui/material/Button";
import {SlidingPopup} from "./dialogs/SlidingPopup";
import RegisterIcon from "@mui/icons-material/HowToReg";
import EditIcon from "@mui/icons-material/Edit";
import {AuthenticateDialog} from "./dialogs/AuthenticateDialog";
import {HttpStatusCode, isAxiosError} from "axios";

function ProfilePage(): JSX.Element {
    // Define state object to store user's personal details
    const [userDetails, setUserDetails] = useState<User>({
        firstNameHeb: "",
        lastNameHeb: "",
        idNumber: "",
        cityName: "",
        phoneNumber: "",
    });

    // page data
    const [isVerified, setIsVerified] = useState(false);
    const [cities, setCities] = useState<City[]>([{cityId: 10, cityName: "תירוש"}]);

    // holds if dialog is open
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isAuthenticateFormOpen, setIsAuthenticateFormOpen] = useState(false);
    const [popupData, setPopupData] = useState<string | null>(null);


    const getIsVerified = async () => {
        try {
            const res = await ServerRequestMaker.MakeGetRequest(
                config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetVerifiedStatus,
            );
            setIsVerified(res.data.isVerified);
            if (!res.data.isVerified) {
                setPopupData("You have limited permission because you are not authenticated, press authenticate to fill missing data");
            }
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 500){
                    console.log("server crashed on verified, st to true");
                    setIsVerified(true);
                }
            } else {
                throw e;
            }
        }

    };

    const getUserInfo = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetProfilePageInfo,
        );
        setUserDetails(res.data);
    };

    const getCities = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Cities.Base,
        );
        setCities(res.data);
    };

    useEffect(() => {
        const f = async () => {
            await getIsVerified();
            await getCities();
        };
        // f();
        getIsVerified();
        getCities();
    }, []);

    useEffect(() => {
        getUserInfo();
    }, [isVerified]);


    const switchUpdateDialogMode = () => {
        setIsUpdateDialogOpen((prev) => !prev);
    };

    const switchAuthenticateFormMode = () => {
        setIsAuthenticateFormOpen((prev) => !prev);
    };

    const onAuthenticate = async () => {
        getIsVerified();
        getUserInfo();
    };

    // TODO: this will cause render whenever input is changed, should switch to useRef, and on submit getting the info
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <>
            <UpdateNumberDialog isOpen={isUpdateDialogOpen} switchMode={switchUpdateDialogMode} fetch={getUserInfo}/>
            <SlidingPopup isOpen={popupData !== null} message={popupData ?? ""} onClose={() => setPopupData(null)}/>
            <AuthenticateDialog userDetails={userDetails} cities={cities} isOpen={isAuthenticateFormOpen}
                                switchMode={switchAuthenticateFormMode} fetch={onAuthenticate}/>
            <Box display="flex" justifyContent="center">
                <Paper elevation={4} sx={{
                    width: 750,
                    height: "85%",
                    marginRight: `${Constants.muiBoxDefaultPadding}px`,
                    marginLeft: `${Constants.muiBoxDefaultPadding}px`,
                    marginTop: `${Constants.muiBoxDefaultPadding}px`,
                    p: "5px",
                }}>
                    <Stack direction={"column"} spacing={2} alignItems={"center"}>
                        <Box justifyContent="center" display="flex" alignItems="center">
                            <Avatar src={userDetails.profilePicUrl ?? ""} alt={userDetails.displayNameEng} sx={{
                                height: "112px",
                                width: "112px",
                            }}/>
                        </Box>
                        <Typography variant={"h3"}>
                            {userDetails.displayNameEng}
                        </Typography>
                        <Divider sx={{width: "95%"}}>English Name</Divider>
                        <Stack direction={"row"} spacing={7}>
                            <Field label={"First Name"} name={"firstNameEng"}
                                   value={userDetails.firstNameEng ?? ""}
                                   onChange={handleInputChange}/>
                            <Field label={"Last Name"} name={"lastNameEng"}
                                   value={userDetails.lastNameEng ?? ""}
                                   onChange={handleInputChange}/>
                        </Stack>
                        <Divider sx={{width: "95%"}}>Hebrew Name</Divider>
                        <Stack direction={"row"} spacing={7}>
                            <Field label={"First Name"} name={"firstNameHeb"}
                                   value={userDetails.firstNameHeb ?? ""}
                                   onChange={handleInputChange}/>
                            <Field label={"Last Name"} name={"lastNameHeb"}
                                   value={userDetails.lastNameHeb ?? ""}
                                   onChange={handleInputChange}/>
                        </Stack>
                        <Divider sx={{width: "95%"}}>Contact</Divider>
                        <Stack direction={"row"} spacing={7}>
                            <Field label={"Phone Number"} name={"phoneNumber"}
                                   value={userDetails.phoneNumber ?? ""}
                                   onChange={handleInputChange}
                                   endAdornment={<EditIcon onClick={switchUpdateDialogMode}
                                                           sx={{cursor: "pointer"}}/>}
                            />
                            <Field label={"Email"} name={"email"}
                                   value={userDetails.email ?? ""}
                                   onChange={handleInputChange}/>

                        </Stack>
                        <Field label={"City"} name={"cityName"}
                               value={userDetails.cityName ?? ""}
                               onChange={handleInputChange}/>
                        {!isVerified && <Box textAlign="center">
                            <Button variant="contained" startIcon={<RegisterIcon/>} size={"large"}
                                    sx={{width: 200}} onClick={switchAuthenticateFormMode}>
                                Authenticate
                            </Button>
                        </Box>}
                    </Stack>
                </Paper>
            </Box>
        </>
    );
}

export default ProfilePage;