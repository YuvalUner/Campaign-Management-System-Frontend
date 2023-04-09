import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import {
    Alert,
    Avatar,
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import NotAuthorizedPage from "../notAuthorizedPage/notAuthorizedPage";
import {UserLoggedInContext} from "../App";
import Campaign from "../models/campaign";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import Constants from "../utils/constantsAndStaticObjects/constants";
import DashboardPage from "./subPages/DashboardPage";

interface MenuListItem {
    name: string;
    icon: JSX.Element;
    goesTo: string;
}

function CampaignPage(): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [enteredCampaign, setEnteredCampaign] = useState(false);
    const loggedInStatus = useContext(UserLoggedInContext);
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    const sideMenuList: MenuListItem[] = [
        {
            name: "Dashboard",
            icon: <DashboardIcon/>,
            goesTo: ""
        }
    ];

    useEffect(() => {
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.Enter + campaignGuid,
            {}
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok){
                setEnteredCampaign(true);

                ServerRequestMaker.MakeGetRequest(
                    config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetBasicInfo
                    + campaignGuid,
                ).then((res) => {
                    if (res.status === HttpStatusCode.Ok){
                        setCampaign(res.data);
                    }
                });
            }
        }).finally(() => {
            setLoading(false);
        });
    }, [campaignGuid, loggedInStatus]);


    const renderMainPage = (): JSX.Element => {
        return (
            !enteredCampaign ?
                <NotAuthorizedPage errorMessage={"You are not a member of this campaign or you are not logged in"}/>
                : <DashboardPage campaign={campaign}/>
        );
    };

    const renderDrawerMenu = (): JSX.Element => {
        return (
            <Drawer anchor={"right"} open={true} variant={"permanent"}  sx={{
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    marginTop: `${Constants.topMenuHeight}px`,
                    height: `calc(100% - ${Constants.topMenuHeight}px)`
                },
            }}>
                <List>
                    {sideMenuList.map((item, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemButton onClick={() => {
                                    nav(ScreenRoutes.CampaignPage + campaignGuid + item.goesTo);
                                }}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
        );
    };

    return (
        <Box sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: `${Constants.muiBoxDefaultPadding}px`,
        }}>
            {loading ?
                <CircularProgress/>
                : <>
                    {renderMainPage()}
                    {renderDrawerMenu()}
                </>
            }
        </Box>
    );
}

export default CampaignPage;
