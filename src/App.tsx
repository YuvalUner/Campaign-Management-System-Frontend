import React, {useState} from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";
import UserWithCampaigns from "./models/user-with-campaigns";
import SideMenu from "./sideMenu/SideMenu";
import {Box} from "@mui/material";
import DrawerPageFlow from "./utils/DrawerPageFlow";
import HomePageControl from "./models/home-page-control";
import Constants from "./utils/constants";


function App(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserWithCampaigns>({} as UserWithCampaigns);
    const [homePageController, setHomePageController] = useState<HomePageControl>({
        limit: Constants.defaultLimit,
        offset: Constants.defaultOffset,
        announcementsAndEvents: null,
    } as HomePageControl);

    return (
        <BrowserRouter>
            <Box sx={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
            }}>
                <TopMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>
                <SideMenu campaignList={user.campaigns}/>
                <DrawerPageFlow isLoggedIn={isLoggedIn}>
                    <Router homePageController={homePageController} setHomePageController={setHomePageController}/>
                </DrawerPageFlow>
            </Box>
        </BrowserRouter>
    );
}

export default App;
