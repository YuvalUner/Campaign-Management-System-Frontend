import React, {useEffect} from "react";
import LogIn from "./LogIn";
import {Box, Button, IconButton, Menu, MenuItem, styled, Toolbar} from "@mui/material";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar";
import Logout from "./Logout";
import Events from "../utils/events";
import UserWithCampaigns from "../models/user-with-campaigns";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import UserProfileImage from "./UserProfileImage";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import Constants from "../utils/constants";
import MenuIcon from "@mui/icons-material/Menu";

interface TopMenuProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;

    user: UserWithCampaigns;
    setUser: (user: UserWithCampaigns) => void;
}

function TopMenu(props: TopMenuProps): JSX.Element {

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = React.useState(false);

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

        // React to opening and closing of the side menu by setting the top menu to open or closed
        Events.subscribe(Events.EventNames.LeftDrawerOpened, () => setIsSideMenuOpen(true));
        Events.subscribe(Events.EventNames.LeftDrawerClosed, () => setIsSideMenuOpen(false));
    });

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

    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }

    // Due to AppBar having a static position, we need to adjust it when the side menu is open or closed using
    // this custom styled AppBar, instead of using the general DrawerPageFlow component.
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== "open",
    })<AppBarProps>(({theme, open}) => ({
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${Constants.drawerWidth}px)`,
            marginLeft: `${Constants.drawerWidth}px`,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    return (
        <AppBar position={"static"} open={isSideMenuOpen}>
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Box>
                    {props.isLoggedIn && <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => Events.dispatch(Events.EventNames.LeftDrawerOpened)}
                        edge="start"
                        disabled={isSideMenuOpen}
                        sx={{mr: 2, ...(isSideMenuOpen && {display: "none"})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    }
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
