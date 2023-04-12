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
import Permission, {PermissionTypes} from "../models/permission";
import MenuListItem from "./utils/menu-list-item";
import PermissionToTabMapper from "./utils/permission-to-tab-mapper";
import ActiveTabsBackup from "./utils/active-tabs-backup";

/**
 * If the user has both edit and view permissions, remove the view permissions - as it is implicit that the user has
 * view permissions if they have edit permissions.
 * @param permissions
 */
const removeViewPermissions = (permissions: Permission[]): Permission[] => {
    // Isolate the view permissions and the edit permissions.
    const viewPermissions = permissions.filter((permission) => permission.permissionType === PermissionTypes.View);
    const editPermissions = permissions.filter((permission) => permission.permissionType === PermissionTypes.Edit);
    // Create a new array to hold the permissions to keep - only the edit permissions to start with.
    // These are split despite starting out the same, so that adding view permissions will not affect
    // other comparisons.
    const permissionsToKeep = permissions.filter((permission) => permission.permissionType === PermissionTypes.Edit);
    // For each view permission, check if there is an edit permission with the same target.
    // If not, add the view permission to the permissions to keep.
    viewPermissions.forEach((viewPermission) => {
        if (!editPermissions.some((editPermission) => editPermission.permissionTarget
            === viewPermission.permissionTarget)) {
            permissionsToKeep.push(viewPermission);
        }
    });
    return permissionsToKeep;
};


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
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [activeTabs, setActiveTabs] = useState<TabPage[]>([]);


    /**
     * Adds a tab to the active tabs array, if it is not already in the array.
     * @param tab The tab to add.
     */
    const addTab = (tab: TabPage): void => {
        if (!activeTabs.some((activeTab) => activeTab.header.text === tab.header.text)) {
            setActiveTabs([tab, ...activeTabs]);
            ActiveTabsBackup.unshift(tab);
        }
    };

    /**
     * Removes a tab from the active tabs array.
     * @param tab the name of the tab to remove.
     */
    const removeTab = (tab: string): void => {
        const tabIndex = ActiveTabsBackup.findIndex((activeTab) => activeTab.header.text === tab);
        if (tabIndex !== -1) {
            ActiveTabsBackup.splice(tabIndex, 1);
            setActiveTabs([...ActiveTabsBackup]);
        }
    };

    /**
     * The list of tabs that can be opened from the side menu.
     * Should contain the tabs that are available to all users as those hard coded here,
     * and any tabs that available to the user based on their permissions should be dynamically loaded.
     */
    const hardcodedSideMenuList: MenuListItem[] = [
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

    const [sideMenuList, setSideMenuList] = useState<MenuListItem[]>(hardcodedSideMenuList);


    /**
     * Gets the campaign information from the server.
     */
    const getCampaign = (): void => {
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
    };

    /**
     * Gets the campaign admins from the server.
     */
    const getCampaignAdmins = ():void => {
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
    };

    /**
     * Gets the user's own permissions from the server.
     */
    const getPermissions = (): void => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Permissions.Base
            + config.ControllerUrls.Permissions.GetSelfPermissions + campaignGuid
        ).then((response) => {
            if (response.status === HttpStatusCode.Ok) {
                const fullPermissionsList = response.data;
                const keptPermissions = removeViewPermissions(fullPermissionsList);
                const addToSideMenuList: MenuListItem[] = [];
                keptPermissions.forEach((permission: Permission) => {
                    addToSideMenuList.push(PermissionToTabMapper(permission, removeTab));
                });
                setPermissions(keptPermissions);
                setSideMenuList([...hardcodedSideMenuList, ...addToSideMenuList]);
            }
        }).catch(() => {
            setPermissions([]);
        });
    };


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
                getCampaign();

                // Simultaneously, get the campaign admins to display on the main page
                getCampaignAdmins();

                // And also, get the permissions of the user to determine which tabs to display
                getPermissions();
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
                            key={activeTabs.length}
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
