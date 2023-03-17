import React, {useEffect, useState} from "react";
import {
    Avatar, Divider,
    Drawer,
    IconButton, List,
    ListItem, ListItemAvatar,
    ListItemButton,
    ListItemText,
    styled, Typography,
    useTheme,
} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import Events from "../utils/events";
import Constants from "../utils/constants";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import CampaignWithRole from "../models/campaign-with-role";

interface SideMenuProps {
    campaignList: CampaignWithRole[] | null;
}

function SideMenu(props: SideMenuProps): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);

    const pageTheme = useTheme();

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
    });

    const DrawerHeader = styled("div")(({theme}) => ({
        display: "flex",
        alignItems: "center",
        // eslint-disable-next-line no-magic-numbers
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    }));

    return (
        <Drawer
            sx={{
                width: Constants.drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: Constants.drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="persistent"
            anchor="left"
            open={isOpen}
        >
            <DrawerHeader>
                <IconButton onClick={() => Events.dispatch(Events.EventNames.LeftDrawerClosed)}>
                    {pageTheme.direction === "ltr" ? <ChevronLeft/> : <ChevronRight/>}
                </IconButton>
            </DrawerHeader>
            <Typography variant="h6" sx={{ml: 2, mb: 2}}>My Campaigns</Typography>
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
    );
}

export default SideMenu;
