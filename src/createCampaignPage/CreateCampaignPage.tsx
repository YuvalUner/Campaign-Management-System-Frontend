import React, {useEffect} from "react";
import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {Link, useNavigate} from "react-router-dom";
import Constants from "../utils/constantsAndStaticObjects/constants";
import Campaign from "../models/campaign";
import City from "../models/city";
import CampaignNameField from "./formFields/CampaignNameField";
import CampaignDescriptionField from "./formFields/CampaignDescriptionField";
import IsMunicipalChoiceField from "./formFields/IsMunicipalChoiceField";
import CampaignLogoUploadField from "./formFields/CampaignLogoUploadField";
import Grid2 from "@mui/material/Unstable_Grid2";
import Events from "../utils/events";
import {HttpStatusCode} from "axios";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";

interface CreateCampaignPageProps {
    setActiveCampaignGuid: (guid: string) => void;
}

function CreateCampaignPage(props: CreateCampaignPageProps): JSX.Element {

    const [awaitingAuthStatusVerification, setAwaitingAuthStatusVerification] = React.useState(true);
    const [authStatus, setAuthStatus] = React.useState(false);
    const campaign = React.useRef<Campaign>({
        campaignName: "",
        campaignDescription: "",
        cityName: "",
        isMunicipal: true,
        campaignLogoUrl: "",
    });
    const [cityList, setCityList] = React.useState<City[]>([]);
    const [serverError, setServerError] = React.useState(false);
    const [photoUploaded, setPhotoUploaded] = React.useState(false);
    const nav = useNavigate();

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
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
                ServerRequestMaker.MakeGetRequest(
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
        let isAllValid = true;
        // Check if all fields are valid.
        if (!campaign.current.campaignName || campaign.current.campaignName.length < 1){
            isAllValid = false;
            Events.dispatch(Events.EventNames.CampaignNameInvalid);
        }
        if (!campaign.current.cityName || campaign.current.cityName.length < 1){
            isAllValid = false;
            Events.dispatch(Events.EventNames.CampaignCityInvalid);
        }
        if (isAllValid){
            Events.dispatch(Events.EventNames.NewCampaignSubmitted);
            // Wait for the photo to be uploaded, after firing the trigger event.
            // eslint-disable-next-line no-unmodified-loop-condition
            while (!photoUploaded){
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            ServerRequestMaker.MakePostRequest(
                config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.CreateCampaign,
                campaign.current
            ).then((res) => {
                if (res.status === HttpStatusCode.Ok){
                    props.setActiveCampaignGuid(res.data.newCampaignGuid);
                    Events.dispatch(Events.EventNames.RefreshCampaignsList);
                    nav(ScreenRoutes.CampaignPage);
                }
            }).catch((res) => {
                // The only fail condition covered by the server but not the client, is if the city name is not
                // one of the cities in the database.
                // All others are impossible to reach, as the client checks for them before sending the request.
                if (res.status === HttpStatusCode.BadRequest){
                    Events.dispatch(Events.EventNames.CampaignCityInvalid);
                }
            });
        }
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
            <Stack component={"form"} direction={"column"} onSubmit={handleSubmit} spacing={3} sx={{
                marginRight: `${Constants.muiBoxDefaultPadding * 5}px`,
                marginLeft: `${Constants.muiBoxDefaultPadding * 5}px`,
            }}>
                <Typography variant={"h4"}>
                    Create a campaign
                </Typography>
                <Stack direction={"column"} spacing={1}>
                    <Grid2 container spacing={10}>
                        <Grid2 xs={12} md={6}>
                            <Stack direction={"column"} spacing={6}>
                                <CampaignNameField campaign={campaign}/>
                                <CampaignDescriptionField campaign={campaign}/>
                                <IsMunicipalChoiceField campaign={campaign} cities={cityList}/>
                            </Stack>
                        </Grid2>
                        <Grid2 xs={12} md={6}>
                            <CampaignLogoUploadField campaign={campaign} setPhotoUploaded={setPhotoUploaded}/>
                        </Grid2>
                    </Grid2>
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
