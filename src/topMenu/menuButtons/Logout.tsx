import React from "react";
// import {useEffect} from "react";
import {googleLogout} from "@react-oauth/google";
import {Box} from "@mui/material";
import ServerRequestMaker from "../../utils/helperMethods/server-request-maker";
import config from "../../app-config.json";
import Events from "../../utils/helperMethods/events";
import UserWithCampaigns from "../../models/user-with-campaigns";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../../utils/constantsAndStaticObjects/screen-routes";

interface LogoutProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserWithCampaigns) => void;
}

/**
 * Logs the user out of the app.
 * @param props
 * @constructor
 */
function Logout(props: LogoutProps): JSX.Element {

    // const windowClosedEvent = "beforeunload";
    const nav = useNavigate();

    /**
     * Logs the user out of the app.
     * Handles logging the user out of the server, the google account, and the app.
     */
    const logout = async (): Promise<void> => {
        props.setIsLoggedIn(false);
        googleLogout();
        await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignOut,
            null
        );
        props.setUser({} as UserWithCampaigns);
        Events.dispatch(Events.EventNames.UserLoggedOut);
        nav(ScreenRoutes.HomePage);
    };

    /**
     * Uncomment this to log the user out when the window is closed.
     * Keep in mind that this will also log the user out when the window is refreshed.
     * This is currently disabled because for now, I figure its better to have the user stay logged in,
     * and it is also much easier to test the app without constantly having to log in.
     * For security purposes, enabling this is better, but for convenience, it is better to disable it.
     */
    // useEffect(() => {
    //     // Make sure that the user is logged out when the window is closed.
    //     // This is used instead of the Events.subscribed method because that method subscribes to document events,
    //     // which are not triggered when the window is closed.
    //     window.addEventListener(windowClosedEvent, logout);
    //     // Unsubscribe from the event when the component is unmounted.
    //     return () => {
    //         window.removeEventListener(windowClosedEvent, logout);
    //     };
    // }, []);

    return (
        <Box onClick={logout}>
            Logout
        </Box>
    );
}

export default Logout;
