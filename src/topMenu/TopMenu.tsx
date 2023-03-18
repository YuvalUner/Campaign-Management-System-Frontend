import React, {useEffect} from "react";
import LogIn from "./LogIn";
import {AppBar, Box, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import Logout from "./Logout";
import Events from "../utils/events";
import UserWithCampaigns from "../models/user-with-campaigns";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import UserProfileImage from "./UserProfileImage";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import Constants from "../utils/constants";

interface TopMenuProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;

    user: UserWithCampaigns;
    setUser: (user: UserWithCampaigns) => void;
}

function TopMenu(props: TopMenuProps): JSX.Element {

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const nav = useNavigate();

    useEffect(() => {
        Events.subscribe(Events.EventNames.UserLoggedIn, async () => {
            const res = await GenericRequestMaker.MakeGetRequest<UserWithCampaigns>(
                config.ControllerUrls.Users.Base + config.ControllerUrls.Users.HomePageInfo,
            );
            const user: UserWithCampaigns = res.data;
            props.setUser(user);
            props.setIsLoggedIn(true);
        });
    }, []);

    const renderUserImageMenu = (): JSX.Element => {
        return (
            <div>
                <UserProfileImage user={props.user.user} onClick={setIsUserMenuOpen}/>
                <Menu open={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }} transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }} sx={{mt: "45px"}} keepMounted>
                    <MenuItem onClick={() => {
                        setIsUserMenuOpen(false);
                        nav(ScreenRoutes.ProfilePage);
                    }}>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={() => setIsUserMenuOpen(false)}>
                        <Logout setIsLoggedIn={props.setIsLoggedIn} setUser={props.setUser}/>
                    </MenuItem>
                </Menu>
            </div>
        );
    };


    return (
        <AppBar position={"static"} sx={{
            height: `${Constants.topMenuHeight}px`,
        }}>
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Box>
                    <Button color={"inherit"} onClick={() => nav(ScreenRoutes.HomePage)}>Home</Button>
                </Box>
                <Box>
                    {props.isLoggedIn ?
                        renderUserImageMenu()
                        : <LogIn/>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopMenu;
