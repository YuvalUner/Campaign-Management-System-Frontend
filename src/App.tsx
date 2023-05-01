import React, {createContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";
import UserWithCampaigns from "./models/user-with-campaigns";
import SideMenu from "./sideMenu/SideMenu";
import {Box, CircularProgress} from "@mui/material";
import DrawerPageFlow from "./utils/DrawerPageFlow";
import ServerRequestMaker from "./utils/helperMethods/server-request-maker";
import config from "./app-config.json";
import {HttpStatusCode} from "axios";
import "./App.css";

const UserLoggedInContext = createContext(false);

function App(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserWithCampaigns>({} as UserWithCampaigns);
    const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.HomePageInfo,
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok && res.data) {
                setUser(res.data);
                setIsLoggedIn(true);
            }
        }).finally(() => {
            setInitialLoadingComplete(true);
        });
    }, []);

    return (
        !initialLoadingComplete ?
            <Box sx={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <CircularProgress/>
            </Box>
            : <UserLoggedInContext.Provider value={isLoggedIn}>
                <BrowserRouter>
                    <Box sx={{
                        display: "flex",
                        height: "100vh",
                        flexDirection: "column",
                    }}>
                        <TopMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>
                        <SideMenu campaignList={user.campaigns} setCampaignList={setUser}/>
                        <DrawerPageFlow>
                            <Router key={"router"}/>
                        </DrawerPageFlow>
                    </Box>
                </BrowserRouter>
            </UserLoggedInContext.Provider>
    );
}

export default App;
export {UserLoggedInContext};
