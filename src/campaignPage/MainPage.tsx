import React from "react";
import Campaign from "../models/campaign";
import {Alert, Avatar, Stack, Typography} from "@mui/material";

interface MainPageProps {
    campaign: Campaign | null;
}

/**
 * The main page of the campaign page, that displays the campaign's logo and name, as well as the campaign's
 * description and the adminstrative staff.
 * @param props
 * @constructor
 */
function MainPage(props: MainPageProps): JSX.Element {
    return (
        <Stack sx={{
            height: "100%",
            width: "100%",
        }} direction={"column"} spacing={2}>
            {props.campaign === null ?
                <Alert severity={"error"}>Error loading campaign</Alert>
                : <>
                    <Stack direction={"row"} spacing={4} alignItems={"center"}>
                        <Avatar src={props.campaign.campaignLogoUrl ?? ""} alt={props.campaign.campaignName} sx={{
                            height: "112px",
                            width: "112px",
                        }}/>
                        <Typography variant={"h4"}>{props.campaign.campaignName}</Typography>
                    </Stack>
                </>
            }
        </Stack>
    );
}

export default MainPage;
