import React, {useState} from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";
import UserWithCampaigns from "./models/user-with-campaigns";
import SideMenu from "./sideMenu/SideMenu";
import {Box} from "@mui/material";
import DrawerPageFlow from "./utils/DrawerPageFlow";


function App(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserWithCampaigns>({} as UserWithCampaigns);

    return (
        <BrowserRouter>
            <Box>
                <TopMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>
                <SideMenu campaignList={user.campaigns}/>
                <DrawerPageFlow>
                    <Router/>
                </DrawerPageFlow>
            </Box>
        </BrowserRouter>
    );
}

export default App;
