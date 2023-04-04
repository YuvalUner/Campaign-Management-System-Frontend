import React, {useEffect, useState} from "react";
import {
    Avatar, Divider,
    Drawer,
    List,
    ListItem, ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import Events from "../utils/events";
import Constants from "../utils/constantsAndStaticObjects/constants";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import CampaignWithRole from "../models/campaign-with-role";

interface SideMenuProps {
    campaignList: CampaignWithRole[] | null;
}

const DrawerOpenContext = React.createContext(false);

function SideMenu(props: SideMenuProps): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);

    const nav = useNavigate();

    useEffect(() => {
        Events.subscribe(Events.EventNames.UserLoggedIn, () => {
            Events.dispatch(Events.EventNames.LeftDrawerOpened);
        });

        Events.subscribe(Events.EventNames.UserLoggedOut, () => {
            Events.dispatch(Events.EventNames.LeftDrawerClosed);
        });

        Events.subscribe(Events.EventNames.LeftDrawerClosed, () => {
            setIsOpen(false);
        });

        Events.subscribe(Events.EventNames.LeftDrawerOpened, () => {
            setIsOpen(true);
        });
    }, []);

    return (
        <DrawerOpenContext.Provider value={isOpen}>
            <Drawer
                sx={{
                    width: Constants.drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: Constants.drawerWidth,
                        boxSizing: "border-box",
                        marginTop: `${Constants.topMenuHeight}px`,
                        height: `calc(100% - ${Constants.topMenuHeight}px)`
                    },
                }}
                variant="persistent"
                anchor="left"
                open={isOpen}
            >
                <Typography variant="h6" sx={{ml: 2, mb: 2, mt: 4}}>My Campaigns</Typography>
                <Divider/>
                <List>
                    {props.campaignList?.map((campaign) => (
                        <ListItem key={campaign.campaignGuid as string} disablePadding>
                            <ListItemButton onClick={() => nav(ScreenRoutes.CampaignPage + campaign.campaignGuid)}>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={campaign.campaignName}
                                        src={campaign.campaignLogoUrl}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={campaign.campaignName} secondary={campaign.roleName}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </DrawerOpenContext.Provider>
    );
}

export default SideMenu;
export {DrawerOpenContext};
