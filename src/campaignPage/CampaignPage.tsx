import React, {useContext, useEffect, useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
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
import SchedulePage from "./subPages/SchedulePage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SubPageNames from "./utils/sub-page-names";
import CampaignProfilePage from "./subPages/CampaignProfilePage";
import CampaignIcon from "@mui/icons-material/Campaign";
import UserWithRole from "../models/user-with-role";
import Permission, {PermissionTargets, PermissionTypes} from "../models/permission";
import MenuListItem from "./utils/menu-list-item";
import PermissionToTabMapper from "./utils/permission-to-tab-mapper";
import SubScreenRoutes from "./utils/sub-screen-routes";
import VotersLedgerPage from "./subPages/VotersLedgerPage";
import NotFoundPage from "../notFoundPage/NotFoundPage";

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
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [enteredCampaign, setEnteredCampaign] = useState(false);
    const loggedInStatus = useContext(UserLoggedInContext);
    const [campaign, setCampaign] = useState<Campaign | null>({} as Campaign);
    const [campaignAdmins, setCampaignAdmins] = useState<UserWithRole[]>([]);
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const [permissions, setPermissions] = useState<Permission[]>([]);


    /**
     * The list of tabs that can be opened from the side menu.
     * Should contain the tabs that are available to all users as those hard coded here,
     * and any tabs that available to the user based on their permissions should be dynamically loaded.
     */
    const hardcodedSideMenuList: MenuListItem[] = [
        {
            name: SubPageNames.MainPage,
            icon: <CampaignIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid,
        },
        {
            name: SubPageNames.Scheduler,
            icon: <CalendarMonthIcon/>,
            navTo: SubScreenRoutes.CampaignBaseComponent + campaignGuid + SubScreenRoutes.SchedulerComponent,
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
                    addToSideMenuList.push(PermissionToTabMapper(permission, campaignGuid as string));
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
        });
    }, [campaignGuid, loggedInStatus]);

    const permissionToRouteMapper = (permission: Permission): JSX.Element => {
        switch (permission.permissionTarget) {
        case PermissionTargets.VotersLedger:
            return <Route path={SubScreenRoutes.VotersLedgerRoute} key={permission.permissionTarget}
                element={<VotersLedgerPage permission={permission}/>}/>;
        default:
            return <Route path={"Error"} key={permission.permissionTarget} element={<NotFoundPage/>}/>;
        }
    };

    /**
     * Renders the main page of the campaign.
     * Switches between the main page when no tabs are open, and the tab component when tabs are open.
     */
    const renderMainPage = (): JSX.Element => {
        return (
            !enteredCampaign ?
                <NotAuthorizedPage errorMessage={"You are not a member of this campaign or you are not logged in"}/>
                : <>
                    {/*{activeTabs.length > 0 ?*/}
                    {/*    <TabComponent heightAdjustMode="Auto"*/}
                    {/*        overflowMode="Scrollable"*/}
                    {/*        enablePersistence={true}*/}
                    {/*        key={activeTabs.length}*/}
                    {/*    >*/}
                    {/*        <TabItemsDirective>*/}
                    {/*            {activeTabs.map((tab, index) => {*/}
                    {/*                return (*/}
                    {/*                    <TabItemDirective key={index} header={tab.header} content={tab.component}>*/}
                    {/*                        {tab.component()}*/}
                    {/*                    </TabItemDirective>*/}
                    {/*                );*/}
                    {/*            })*/}
                    {/*            }*/}
                    {/*        </TabItemsDirective>*/}
                    {/*    </TabComponent>*/}
                    {/*    : <CampaignProfilePage campaign={campaign} campaignAdmins={campaignAdmins}/>*/}
                    {/*}*/}
                    <Routes>
                        <Route path={SubScreenRoutes.CampaignBaseRoute}
                            element={<CampaignProfilePage campaign={campaign} campaignAdmins={campaignAdmins}/>}/>
                        <Route path={SubScreenRoutes.SchedulerRoute} element={<SchedulePage campaign={campaign}/>}/>
                        {/*<Route path={SubScreenRoutes.VotersLedgerRoute} element={<VotersLedgerPage permission={{*/}
                        {/*    permissionTarget: PermissionTargets.VotersLedger,*/}
                        {/*    permissionType: PermissionTypes.View,*/}
                        {/*}}/>}/>*/}
                        {permissions.map((permission) => {
                            return permissionToRouteMapper(permission);
                        })}
                    </Routes>
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
                                    nav(item.navTo);
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
            : <Box sx={{
                marginRight: `${Constants.rightDrawerWidth}px`,
                marginLeft: `${Constants.muiBoxDefaultPadding}px`,
                height: "100%",
            }}>
                {renderMainPage()}
                {renderDrawerMenu()}
            </Box>
    );
}

export default CampaignPage;
