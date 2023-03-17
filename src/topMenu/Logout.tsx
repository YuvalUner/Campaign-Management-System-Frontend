import React from "react";
import {googleLogout} from "@react-oauth/google";
import {Box} from "@mui/material";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import Events from "../utils/events";
import UserWithCampaigns from "../models/user-with-campaigns";

interface LogoutProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserWithCampaigns) => void;
}

function Logout(props: LogoutProps): JSX.Element {

    const logout = async (): Promise<void> => {
        props.setIsLoggedIn(false);
        googleLogout();
        await GenericRequestMaker.MakePostRequest(
            config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignOut,
            null
        );
        props.setUser({} as UserWithCampaigns);
        Events.dispatch(Events.EventNames.UserLoggedOut);
    };

    return (
        <Box onClick={logout}>
            Logout
        </Box>
    );
}

export default Logout;
