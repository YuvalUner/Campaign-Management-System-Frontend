import React from "react";
import {googleLogout} from "@react-oauth/google";
import {Box} from "@mui/material";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";

interface LogoutProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Logout(props: LogoutProps): JSX.Element {

    const logout = async (): Promise<void> => {
        props.setIsLoggedIn(false);
        googleLogout();
        await GenericRequestMaker.MakePostRequest(
            config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignOut,
            null
        );
    };

    return (
        <Box onClick={logout}>
            Logout
        </Box>
    );
}

export default Logout;
