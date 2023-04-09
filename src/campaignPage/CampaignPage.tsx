import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import {Box, CircularProgress} from "@mui/material";
import NotAuthorizedPage from "../notAuthorizedPage/notAuthorizedPage";

function CampaignPage(): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const [loading, setLoading] = useState(true);
    const [enteredCampaign, setEnteredCampaign] = useState(false);

    useEffect(() => {
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.Enter + campaignGuid,
            {}
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok){
                setEnteredCampaign(true);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const renderMainPage = (): JSX.Element => {
        return (
            !enteredCampaign ?
                <NotAuthorizedPage errorMessage={"You are not a member of this campaign or you are not logged in"}/>
                : <h1>Entered campaign</h1>
        );
    };

    return (
        <Box sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {loading ?
                <CircularProgress/>
                : renderMainPage()
            }
        </Box>
    );
}

export default CampaignPage;
