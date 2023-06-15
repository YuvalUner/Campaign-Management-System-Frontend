import React, {useEffect} from "react";
import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import ServerRequestMaker from "../utils/helperMethods/server-request-maker";
import config from "../app-config.json";
import {useNavigate} from "react-router-dom";
import Constants from "../utils/constantsAndStaticObjects/constants";
import Campaign from "../models/campaign";
import City from "../models/city";
import CampaignNameField from "./formFields/CampaignNameField";
import CampaignDescriptionField from "./formFields/CampaignDescriptionField";
import CampaignTypeMultipleChoiceField from "./formFields/CampaignTypeMultipleChoiceField";
import CampaignLogoUploadField from "./formFields/CampaignLogoUploadField";
import Grid2 from "@mui/material/Unstable_Grid2";
import Events from "../utils/helperMethods/events";
import {HttpStatusCode} from "axios";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import ImageBbApiRequestMaker from "../utils/helperMethods/image-bb-api-request-maker";
import {FileObject} from "mui-file-dropzone";

/**
 * This component is used to create a new campaign.
 * A user can create a new campaign by filling out the form and clicking the "Create Campaign" button.
 * It is also possible to upload a logo for the campaign.
 */
function CreateCampaignPage(): JSX.Element {

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
    const [uploadedFile, setUploadedFile] = React.useState<File | null | FileObject>(null);

    const nav = useNavigate();

    // This effect is used to check if the user is verified. If they are, the list of cities is fetched.
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
                    config.ControllerUrls.Cities.Base + config.ControllerUrls.Cities.GetAllCities,
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

    /**
     * Uploads the campaign logo to imgbb.com and sets the campaign logo url to the url returned by the API.
     */
    const uploadToImgBb = async (): Promise<void> => {
        if (uploadedFile) {
            const response = await ImageBbApiRequestMaker.uploadImage(uploadedFile as File);
            if (response.status === HttpStatusCode.Ok) {
                campaign.current.campaignLogoUrl = response.data.data.url;
            }
        } else {
            campaign.current.campaignLogoUrl = null;
        }
    };

    /**
     * Handles the submit event of the form.
     * Validates the form and sends the request to the server.
     * @param event
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        let isAllValid = true;
        // Check if all fields are valid.
        if (!campaign.current.campaignName || campaign.current.campaignName.length < 1) {
            isAllValid = false;
            Events.dispatch(Events.EventNames.CampaignNameInvalid);
        }
        if (campaign.current.isMunicipal && (!campaign.current.cityName || campaign.current.cityName.length < 1)) {
            isAllValid = false;
            Events.dispatch(Events.EventNames.CampaignCityInvalid);
        }
        // If all fields are valid, upload the campaign logo to imgbb.com and send the request to the server.
        if (isAllValid) {
            await uploadToImgBb();
            ServerRequestMaker.MakePostRequest(
                config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.CreateCampaign,
                campaign.current,
            ).then((res) => {
                if (res.status === HttpStatusCode.Ok) {
                    Events.dispatch(Events.EventNames.RefreshCampaignsList);
                    nav(ScreenRoutes.CampaignPage + res.data.newCampaignGuid);
                }
            }).catch((res) => {
                // The only fail condition covered by the server but not the client, is if the city name is not
                // one of the cities in the database.
                // All others are impossible to reach, as the client checks for them before sending the request.
                if (res.status === HttpStatusCode.BadRequest) {
                    Events.dispatch(Events.EventNames.CampaignCityInvalid);
                }
            });
        }
    };

    /**
     * Handles the rendering of the main part of the page.
     * Will render a form if the user is verified, or a message if the user is not verified.
     */
    const renderPage = (): JSX.Element => {
        if (serverError){
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
                                <CampaignTypeMultipleChoiceField campaign={campaign} cities={cityList}
                                    authStatus={authStatus}/>
                            </Stack>
                        </Grid2>
                        <Grid2 xs={12} md={6}>
                            <CampaignLogoUploadField campaign={campaign}
                                uploadedFile={uploadedFile}
                                setUploadedFile={setUploadedFile}/>
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
