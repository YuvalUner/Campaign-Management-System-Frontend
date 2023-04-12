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
import {TabPage} from "../models/tab-page";
import TabNames from "./utils/tabNames";
import MainPage from "./MainPage";
import CampaignIcon from "@mui/icons-material/Campaign";
import MainPageAsTab from "./TabPages/MainPageAsTab";
import UserWithRole from "../models/user-with-role";


interface MenuListItem {
    name: string;
    icon: JSX.Element;
    tab: TabPage;
}

/**
 * The CampaignPage component is the page that displays the campaign that the user has entered.
 * It functions as a web-app, with tabs that can be opened and closed.
 */
function CampaignPage(): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [loading, setLoading] = useState(true);
    const [enteredCampaign, setEnteredCampaign] = useState(false);
    const loggedInStatus = useContext(UserLoggedInContext);
    const [campaign, setCampaign] = useState<Campaign | null>({} as Campaign);
    const [campaignAdmins, setCampaignAdmins] = useState<UserWithRole[]>([]);

    const [activeTabs, setActiveTabs] = useState<TabPage[]>([]);

    /**
     * Adds a tab to the active tabs array, if it is not already in the array.
     * @param tab The tab to add.
     */
    const addTab = (tab: TabPage): void => {
        if (!activeTabs.some((activeTab) => activeTab.header.text === tab.header.text)) {
            setActiveTabs([tab, ...activeTabs]);
        }
    };

    /**
     * Removes a tab from the active tabs array.
     * @param tab the name of the tab to remove.
     */
    const removeTab = (tab: string): void => {
        setActiveTabs(activeTabs.filter((activeTab) => activeTab.header.text !== tab));
    };


    /**
     * The list of tabs that can be opened from the side menu.
     * Should contain the tabs that are available to all users as those hard coded here,
     * and any tabs that available to the user based on their permissions should be dynamically loaded.
     */
    const sideMenuList: MenuListItem[] = [
        {
            name: TabNames.MainPage,
            icon: <CampaignIcon/>,
            tab: {
                header: {text: TabNames.MainPage},
                component: () => {
                    return <MainPageAsTab campaign={campaign} name={TabNames.MainPage}
                        closeFunction={removeTab} campaignAdmins={campaignAdmins}/>;
                }
            }
        },
        {
            name: TabNames.Scheduler,
            icon: <CalendarMonthIcon/>,
            tab: {
                header: {text: TabNames.Scheduler},
                component: () => {
                    return <ScheduleTab campaign={campaign} name={TabNames.Scheduler} closeFunction={removeTab}/>;
                }
            }
        },
    ];


    useEffect(() => {
        // First, check if the user is logged in and if they are a member of the campaign
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.Enter + campaignGuid,
            {},
        ).then((res) => {
            // If they are, approve entry to the campaign
            if (res.status === HttpStatusCode.Ok) {
                setEnteredCampaign(true);

                // Then, get the campaign information
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

                ServerRequestMaker.MakeGetRequest(
                    config.ControllerUrls.Campaigns.Base
                    + config.ControllerUrls.Campaigns.GetCampaignAdmins + campaignGuid
                ).then((response) => {
                    if (response.status === HttpStatusCode.Ok) {
                        setCampaignAdmins(response.data);
                    }
                }).catch(() => {
                    setCampaignAdmins([]);
                });
            }
        }).catch(() => {
            // If the server returned 401, do not approve entry on client side as well.
            setEnteredCampaign(false);
        }).finally(() => {
            setLoading(false);
            setActiveTabs([]);
        });
    }, [campaignGuid, loggedInStatus]);

    /**
     * Renders the main page of the campaign.
     * Switches between the main page when no tabs are open, and the tab component when tabs are open.
     */
    const renderMainPage = (): JSX.Element => {
        return (
            !enteredCampaign ?
                <NotAuthorizedPage errorMessage={"You are not a member of this campaign or you are not logged in"}/>
                : <>
                    {activeTabs.length > 0 ?
                        <TabComponent heightAdjustMode="Auto"
                            overflowMode="Scrollable"
                            enablePersistence={true}
                            //key={activeTabs.length}
                        >
                            <TabItemsDirective>
                                {activeTabs.map((tab, index) => {
                                    return (
                                        <TabItemDirective key={index} header={tab.header} content={tab.component}>
                                            {tab.component()}
                                        </TabItemDirective>
                                    );
                                })
                                }
                            </TabItemsDirective>
                        </TabComponent>
                        : <MainPage campaign={campaign} campaignAdmins={campaignAdmins}/>
                    }
                </>
        );
    };

    /**
     * Renders the side menu.
     * This menu is permanently open.
     */
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
