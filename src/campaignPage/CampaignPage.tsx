import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import {
    Box,
    CircularProgress,
    Drawer,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import NotAuthorizedPage from "../notAuthorizedPage/notAuthorizedPage";
import {UserLoggedInContext} from "../App";
import Campaign from "../models/campaign";
import Constants from "../utils/constantsAndStaticObjects/constants";
import ScheduleTab from "./TabPages/ScheduleTab";
import {TabComponent, TabItemDirective, TabItemsDirective} from "@syncfusion/ej2-react-navigations";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TestPage from "./TabPages/TestPage";
import {TabPage} from "../models/tab-page";
import TabNames from "./utils/tabNames";


interface MenuListItem {
    name: string;
    icon: JSX.Element;
    tab: TabPage;
}

function CampaignPage(): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [loading, setLoading] = useState(true);
    const [enteredCampaign, setEnteredCampaign] = useState(false);
    const loggedInStatus = useContext(UserLoggedInContext);
    const [campaign, setCampaign] = useState<Campaign | null>({} as Campaign);

    const [activeTabs, setActiveTabs] = useState<TabPage[]>([]);

    const addTab = (tab: TabPage): void => {
        if (!activeTabs.some((activeTab) => activeTab.header.text === tab.header.text)) {
            setActiveTabs([tab, ...activeTabs]);
        }
    };

    const removeTab = (tab: string): void => {
        setActiveTabs(activeTabs.filter((activeTab) => activeTab.header.text !== tab));
    };

    const sideMenuList: MenuListItem[] = [
        {
            name: TabNames.Scheduler,
            icon: <CalendarMonthIcon/>,
            tab: {
                header: {text: "Schedule"},
                component: () => {
                    return <ScheduleTab campaign={campaign} name={TabNames.Scheduler} closeFunction={removeTab}/>;
                }
            }
        },
        {
            name: "Test",
            icon: <CalendarMonthIcon/>,
            tab: {
                header: {text: "Test"},
                component: () => {
                    return <TestPage/>;
                }
            }
        }
    ];


    useEffect(() => {
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.Enter + campaignGuid,
            {},
        ).then((res) => {
            if (res.status === HttpStatusCode.Ok) {
                setEnteredCampaign(true);

                ServerRequestMaker.MakeGetRequest(
                    config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.GetBasicInfo
                    + campaignGuid,
                ).then((response) => {
                    if (response.status === HttpStatusCode.Ok) {
                        setCampaign(response.data);
                    }
                }).catch(() => {
                    setCampaign(null);
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
                : <>
                    <TabComponent heightAdjustMode="Auto"
                        overflowMode="Scrollable"
                        allowDragAndDrop={true}
                        enablePersistence={true}
                        id={"draggableTab"} dragArea="#container"
                    >
                        <TabItemsDirective>
                            {activeTabs.map((tab, index) => {
                                return (
                                    <TabItemDirective key={index} header={tab.header} content={tab.component}/>
                                );
                            })}
                        </TabItemsDirective>
                    </TabComponent>
                </>
        );
    };

    const renderDrawerMenu = (): JSX.Element => {
        return (
            <Drawer anchor={"right"} open={true} variant={"permanent"} sx={{
                width: Constants.rightDrawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: Constants.rightDrawerWidth,
                    boxSizing: "border-box",
                    marginTop: `${Constants.topMenuHeight}px`,
                    height: `calc(100% - ${Constants.topMenuHeight}px)`,
                },
            }}>
                <List>
                    {sideMenuList.map((item, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemButton onClick={() => {
                                    addTab(item.tab);
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
        loading ?
            <Box sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <CircularProgress/>
            </Box>
            : <Box>
                {renderMainPage()}
                {renderDrawerMenu()}
            </Box>
    );
}

export default CampaignPage;
