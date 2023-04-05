import React, {useEffect} from "react";
import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {Link} from "react-router-dom";
import Constants from "../utils/constantsAndStaticObjects/constants";
import Campaign from "../models/campaign";
import City from "../models/city";
import CampaignNameField from "./formFields/CampaignNameField";
import CampaignDescriptionField from "./formFields/CampaignDescriptionField";
import CampaignCityField from "./formFields/CampaignCityField";

function CreateCampaignPage(): JSX.Element {

    const [awaitingAuthStatusVerification, setAwaitingAuthStatusVerification] = React.useState(true);
    const [authStatus, setAuthStatus] = React.useState(false);
    const campaign = React.useRef<Campaign>({
        campaignName: "",
        campaignDescription: "",
        cityName: "",
    });
    const [cityList, setCityList] = React.useState<City[]>([]);
    const [serverError, setServerError] = React.useState(false);

    useEffect(() => {
        GenericRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetVerifiedStatus,
        ).then((res) => {
            setAwaitingAuthStatusVerification(false);
            // Equals operator is used because under very odd (specifically, a server restart) circumstances,
            // the response can be null.
            setAuthStatus(res.data.isVerified === true);

            // If the user is verified, get the list of cities to populate the dropdown.
            // The boolean equality is used again because setAuthStatus is asynchronous, and the value of
            // authStatus may not be updated by the time this code is executed.
            if (res.data.isVerified === true) {
                GenericRequestMaker.MakeGetRequest(
                    config.ControllerUrls.Cities.Base + config.ControllerUrls.Cities.GetAllCities
                ).then((cities) => {
                    const citiesList = cities.data;
                    citiesList.sort((a: City, b: City) => {
                        b.cityName.localeCompare(a.cityName);
                    });
                    setCityList(citiesList);
                });
            }
            // Only time this should happen is if the server is down or a critical error occurs, as the endpoint
            // has no fail condition.
        }).catch(() => {
            setServerError(true);
            setAwaitingAuthStatusVerification(false);
        });
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
    };

    const renderPage = (): JSX.Element => {
        // Handling for the case where the user's verification status is either unknown or false - render a message.
        if (!authStatus){
            if (!serverError) {
                return (
                    <Typography variant={"h5"}>
                        You must be verified to create a campaign. Please verify <Link to={"/profile"}>here</Link>.
                    </Typography>
                );
            }
            return (
                <Typography variant={"h5"}>
                        Server error. Please try again later.
                </Typography>
            );
        }
        // Handling for the case where the user is verified - render the form.
        return (
            <Stack component={"form"} direction={"column"} onSubmit={handleSubmit} spacing={3}>
                <Typography variant={"h4"}>
                    Create a campaign
                </Typography>
                <Stack direction={"column"} spacing={1} sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Constants.muiBoxDefaultPadding
                }}>
                    <CampaignNameField campaign={campaign}/>
                    <CampaignDescriptionField campaign={campaign}/>
                    <CampaignCityField campaign={campaign} cities={cityList}/>
                    <Button variant={"contained"} type={"submit"}>Create</Button>
                </Stack>
            </Stack>
        );
    };

    return (
        <>
            {awaitingAuthStatusVerification && <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
                <CircularProgress/>
            </Box>}
            {!awaitingAuthStatusVerification && renderPage()}
        </>
    );
}

export default CreateCampaignPage;
