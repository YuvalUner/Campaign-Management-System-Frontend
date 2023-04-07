import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {UserLoggedInContext} from "../App";
import Campaign from "../models/campaign";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import NotFoundPage from "../notFoundPage/NotFoundPage";

function JoinCampaignPage(): JSX.Element {

    const params = useParams();
    const inviteGuid = params.inviteGuid;
    const loggedInStatus = useContext(UserLoggedInContext);

    const [campaign, setCampaign] = useState<Campaign | null>({} as Campaign);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetInfoByInviteGuid + inviteGuid,
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok){
                setCampaign(res.data);
            }
        }).catch(() => {
            setCampaign(null);
        });
    }, []);

    const renderMainContent = (): JSX.Element => {
        return (
            <>
                {campaign === null ?
                    <NotFoundPage errorMessage={"The campaign you are trying to join does not exist"}/>
                    :
                    <Box sx={{
                        border: "1px solid black",
                        padding: "10px",
                        borderRadius: "5px",
                    }}>
                    </Box>
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
            {renderMainContent()}
        </Box>
    );
}

export default JoinCampaignPage;
