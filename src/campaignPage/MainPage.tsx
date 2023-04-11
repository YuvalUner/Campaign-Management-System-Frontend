import React, {useContext} from "react";
import Campaign from "../models/campaign";
import {Alert, Avatar, Box, Stack, Typography} from "@mui/material";
import Constants from "../utils/constantsAndStaticObjects/constants";
import {DrawerOpenContext} from "../sideMenu/SideMenu";

interface MainPageProps {
    campaign: Campaign | null;
}

/**
 * The main page of the campaign page, that displays the campaign's logo and name, as well as the campaign's
 * description and the administrative staff.
 * @param props
 * @constructor
 */
function MainPage(props: MainPageProps): JSX.Element {

    const drawerOpen = useContext(DrawerOpenContext);

    return (
        <Stack sx={{
            height: "100%",
            width: `calc(100% - ${Constants.rightDrawerWidth} 
                        - ${drawerOpen ? Constants.leftDrawerWidth : 0})px`,
            marginRight: `${Constants.rightDrawerWidth}px`,
            paddingRight: `${Constants.muiBoxDefaultPadding}px`,
            paddingLeft: `${Constants.muiBoxDefaultPadding}px`,
            marginTop: `${Constants.muiBoxDefaultPadding}px`,
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
                    <Stack sx={{
                        border: "1px solid black",
                        padding: "8px",
                    }} direction={"column"}>
                        <Typography variant={"h5"}>Description</Typography>
                        <Box sx={{
                            padding: "8px",
                        }}>
                            <Typography paragraph>{props.campaign.campaignDescription}</Typography>
                        </Box>
                    </Stack>
                </>
            }
        </Stack>
    );
}

export default MainPage;
