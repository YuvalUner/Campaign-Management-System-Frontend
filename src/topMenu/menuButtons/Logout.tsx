import React, {useEffect} from "react";
import {googleLogout} from "@react-oauth/google";
import {Box} from "@mui/material";
import GenericRequestMaker from "../../utils/generic-request-maker";
import config from "../../app-config.json";
import Events from "../../utils/events";
import UserWithCampaigns from "../../models/user-with-campaigns";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../../utils/constantsAndStaticObjects/screen-routes";

interface LogoutProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserWithCampaigns) => void;
}

function Logout(props: LogoutProps): JSX.Element {

    const windowClosedEvent = "beforeunload";
    const nav = useNavigate();

    const logout = async (): Promise<void> => {
        props.setIsLoggedIn(false);
        googleLogout();
        await GenericRequestMaker.MakePostRequest(
            config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignOut,
            null
        );
        props.setUser({} as UserWithCampaigns);
        Events.dispatch(Events.EventNames.UserLoggedOut);
        nav(ScreenRoutes.HomePage);
    };

    useEffect(() => {
        // Make sure that the user is logged out when the window is closed.
        // This is used instead of the Events.subscribed method because that method subscribes to document events,
        // which are not triggered when the window is closed.
        window.addEventListener(windowClosedEvent, logout);
        // Unsubscribe from the event when the component is unmounted.
        return () => {
            window.removeEventListener(windowClosedEvent, logout);
        };
    }, []);

    return (
        <Box onClick={logout}>
            Logout
        </Box>
    );
}

export default Logout;
