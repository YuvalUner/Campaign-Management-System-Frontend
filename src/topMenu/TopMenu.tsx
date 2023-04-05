import React, {useEffect} from "react";
import LogIn from "./menuButtons/LogIn";
import {AppBar, Box, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import Logout from "./menuButtons/Logout";
import Events from "../utils/events";
import UserWithCampaigns from "../models/user-with-campaigns";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import UserProfileImage from "./menuButtons/UserProfileImage";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import Constants from "../utils/constantsAndStaticObjects/constants";

interface TopMenuProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;

    user: UserWithCampaigns;
    setUser: (user: UserWithCampaigns) => void;
}

function TopMenu(props: TopMenuProps): JSX.Element {

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState<null | HTMLElement>(null);

    const nav = useNavigate();

    const handleClose = () => {
        setIsUserMenuOpen(null);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setIsUserMenuOpen(event.currentTarget);
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.UserLoggedIn, async () => {
            const res = await ServerRequestMaker.MakeGetRequest<UserWithCampaigns>(
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
                <UserProfileImage user={props.user.user} onClick={handleMenu}/>
                <Menu open={Boolean(isUserMenuOpen)} anchorEl={isUserMenuOpen} onClose={handleClose} anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }} transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }} sx={{mt: "45px"}} keepMounted>
                    <MenuItem onClick={() => {
                        handleClose();
                        nav(ScreenRoutes.ProfilePage);
                    }}>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Logout setIsLoggedIn={props.setIsLoggedIn} setUser={props.setUser}/>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        nav(ScreenRoutes.PersonalBallotPage);
                    }}>
                        My Ballot
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    const renderMenuAvailableToLoggedInUsers = (): JSX.Element => {
        return (<>
            <Button color={"inherit"} onClick={() => nav(ScreenRoutes.CreateCampaignPage)}>Create Campaign</Button>
        </>);
    };


    return (
        <AppBar position={"sticky"} sx={{
            height: `${Constants.topMenuHeight}px`,
        }}>
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Box>
                    <Button color={"inherit"} onClick={() => nav(ScreenRoutes.HomePage)}>Home</Button>
                    {props.isLoggedIn && renderMenuAvailableToLoggedInUsers()}
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
