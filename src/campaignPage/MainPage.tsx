import React from "react";
import Campaign from "../models/campaign";
import {Alert, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from "@mui/material";
import Constants from "../utils/constantsAndStaticObjects/constants";
import UserWithRole, {sortUsersByRoleLevel} from "../models/user-with-role";
import Grid2 from "@mui/material/Unstable_Grid2";

export interface MainPageProps {
    campaign: Campaign | null;
    campaignAdmins: UserWithRole[];
}

/**
 * The main page of the campaign page, that displays the campaign's logo and name, as well as the campaign's
 * description and the administrative staff.
 * @param props
 * @constructor
 */
function MainPage(props: MainPageProps): JSX.Element {

    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const [_, campaignManagers, candidates, campaignOwners] = sortUsersByRoleLevel(props.campaignAdmins);

    const renderAdminStaffList = (users: UserWithRole[], roleName: string) => {
        return (
            <Stack direction={"column"} spacing={2} sx={{
                border: "1px solid black",
                height: "100%",
                overflow: "auto",
            }}>
                <Typography variant={"h5"} sx={{
                    textAlign: "center",
                    marginTop: "8px",
                }}>{roleName}</Typography>
                <List>
                    {users.map((user, index) => {
                        return(
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar src={user.profilePicUrl ?? ""} alt={user.displayNameEng}/>
                                </ListItemAvatar>
                                <ListItemText primary={user.firstNameHeb + " " + user.lastNameHeb}/>
                            </ListItem>
                        );
                    })}
                </List>
            </Stack>
        );
    };

    return (
        <Stack sx={{
            height: "100%",
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
                    <Grid2 container spacing={2} sx={{
                        height: "100%",
                    }}>
                        <Grid2 xs={4}>
                            {renderAdminStaffList(campaignOwners, "Campaign Owners")}
                        </Grid2>
                        <Grid2 xs={4}>
                            {renderAdminStaffList(candidates, "Candidates")}
                        </Grid2>
                        <Grid2 xs={4}>
                            {renderAdminStaffList(campaignManagers, "Campaign Managers")}
                        </Grid2>
                    </Grid2>
                </>
            }
        </Stack>
    );
}

export default MainPage;
