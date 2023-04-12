import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Alert, Avatar, Box, CircularProgress, Stack, Typography} from "@mui/material";
import {UserLoggedInContext} from "../App";
import Campaign from "../models/campaign";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import NotFoundPage from "../notFoundPage/NotFoundPage";
import joinStyles from "./joinCampaignPage.module.css";
import Events from "../utils/events";
import {Button} from "react-bootstrap";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import ExternalAuthDto from "../models/external-auth-dto";
import {StatusCodes} from "http-status-codes";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import errorCodeExtractor from "../utils/error-code-extractor";
import CustomStatusCode from "../utils/constantsAndStaticObjects/custom-status-code";


/**
 * The page for accepting campaign invites and joining campaigns.
 * @constructor
 */
function JoinCampaignPage(): JSX.Element {

    const params = useParams();
    const inviteGuid = params.inviteGuid;
    const loggedInStatus = useContext(UserLoggedInContext);
    const nav = useNavigate();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [verifiedError, setVerifiedError] = useState<boolean>(false);
    const [alreadyJoined, setAlreadyJoined] = useState<boolean>(false);

    useEffect(() => {
        // Get the campaign info from the invite guid.
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetInfoByInviteGuid + inviteGuid,
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok){
                setCampaign(res.data);
            }
        }).catch(() => {
            setCampaign(null);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        // While this page is loaded, hide effects such as drawer opening upon logging in.
        Events.dispatch(Events.EventNames.ShouldHideEffects, true);
        return () => {
            // When the page is unloaded, show effects again.
            Events.dispatch(Events.EventNames.ShouldHideEffects, false);
        };
    }, []);

    /**
     * Accepts the invite and navigates to the campaign page.
     */
    const acceptInvite = async (): Promise<void> => {
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Invites.Base + config.ControllerUrls.Invites.AcceptInvite + inviteGuid,
            {}
        ).then((res) => {
            // Campaign invite accepted successfully, navigate to the campaign page.
            const campaignGuid = res.data.CampaignGuid;
            Events.dispatch(Events.EventNames.RefreshCampaignsList);
            nav(ScreenRoutes.CampaignPage + campaignGuid);
        }).catch((err) => {
            const errCode = errorCodeExtractor(err.response.data);
            // Request rejected because user is already a member of the campaign, show error message.
            if (errCode === CustomStatusCode.DuplicateKey){
                setAlreadyJoined(true);
                // Request rejected because user is not verified, show error message.
            } else if (errCode === CustomStatusCode.VerificationStatusError){
                setVerifiedError(true);
            }
        });
    };

    /**
     * onSuccess function for the GoogleLogin component. Sends the id token to the server to log in the user.
     * Afterwards, calls acceptInvite to accept the invite.
     * @param response
     */
    const onSuccess = async (response: CredentialResponse): Promise<void> => {

        const externalAuth: ExternalAuthDto = {
            idToken: response.credential as string,
            provider: config.OAuthProvider,
        };

        ServerRequestMaker.MakePostRequest(
            (config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignIn) as string,
            externalAuth,
        ).then((res) => {
            if (res.status === StatusCodes.CREATED || res.status === StatusCodes.OK) {
                Events.dispatch(Events.EventNames.UserLoggedIn);
                acceptInvite();
            }
        });
    };

    /**
     * Renders the accept button. If the user is logged in, the button is enabled and calls acceptInvite.
     * Otherwise, a Google login button is rendered, that calls onSuccess when the user logs in.
     */
    const renderAcceptButton = (): JSX.Element => {
        return (
            <Stack direction={"column"} spacing={1} alignItems={"center"} alignContent={"center"}>
                {loggedInStatus ?
                    <Button onClick={acceptInvite} disabled={alreadyJoined || verifiedError}>Join Campaign</Button>
                    : <>
                        <Typography variant={"caption"}>
                            Click the button below to log in and join the campaign
                        </Typography>
                        <GoogleLogin onSuccess={onSuccess} theme={"filled_blue"}/>
                    </>
                }
                <Typography variant={"caption"}>
                    * By joining, you agree to let the campaign&#39;s managers to view your name and email.
                </Typography>
            </Stack>
        );
    };

    /**
     * Render the main visual content of the page.
     */
    const renderMainContent = (): JSX.Element => {
        return (
            <>
                {campaign === null ?
                    <NotFoundPage errorMessage={"The campaign you are trying to join does not exist"}/>
                    :
                    <Stack direction={"column"} alignContent={"center"}
                        alignItems={"center"} className={joinStyles.main_form_box} spacing={3}>
                        <Typography variant={"h4"}>Join Campaign</Typography>
                        <Typography variant={"h5"}><b>{campaign.campaignName}</b></Typography>
                        <Avatar sx={{
                            width: 56,
                            height: 56,
                        }} src={campaign.campaignLogoUrl ?? ""} alt={campaign.campaignName}/>
                        <Typography variant={"body1"} paragraph sx={{
                            textAlign: "center",
                            lineBreak: "auto"
                        }}>{campaign.campaignDescription}</Typography>
                        <Stack direction={"column"} spacing={1} alignItems={"center"} alignContent={"center"}>
                            {renderAcceptButton()}
                            {alreadyJoined && <Alert severity={"error"}>You have already joined this campaign</Alert>}
                            {verifiedError &&
                                <Alert severity={"error"}>
                                    You must be verified to join a campaign. Please verify your account
                                    <Link to={ScreenRoutes.ProfilePage}> here</Link>
                                </Alert>
                            }
                        </Stack>
                    </Stack>
                }
            </>
        );
    };

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
        }}>

            {isLoading ?
                <CircularProgress/>
                : renderMainContent()
            }
        </Box>
    );
}

export default JoinCampaignPage;
