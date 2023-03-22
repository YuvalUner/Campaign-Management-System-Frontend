import React, {useEffect, memo, useContext} from "react";
import Constants from "./constants";
import {Box, IconButton, styled, Tooltip} from "@mui/material";
import Events from "./events";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import componentIds from "./component-ids";
import {UserLoggedInContext} from "../App";

interface DrawerPageFlowProps {
    children: JSX.Element ;
}

function DrawerPageFlow(props: DrawerPageFlowProps): JSX.Element {

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const isLoggedIn = useContext(UserLoggedInContext);

    useEffect(() => {
        Events.subscribe(Events.EventNames.LeftDrawerOpened, () => {
            setIsDrawerOpen(true);
        });

        Events.subscribe(Events.EventNames.LeftDrawerClosed, () => {
            setIsDrawerOpen(false);
        });
    }, []);

    const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})<{
        open?: boolean;
    }>(({theme, open}) => ({
        flexGrow: 1,
        // eslint-disable-next-line no-magic-numbers
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: `${Constants.drawerWidth}px`,
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    return (
        <Main open={isDrawerOpen} sx={{
            display: "flex",
            flexDirection: "column",
            height: `calc(100% - ${Constants.topMenuHeight * 2.5}px)`,
            paddingBottom: "0px",
        }}>
            <Box sx={{
                marginBottom: `${Constants.muiBoxDefaultPadding}px`,
                overflow: "hidden",
                marginLeft: isLoggedIn ? `${Constants.muiBoxDefaultPadding}px` : "0px",
            }} id={componentIds.DrawerPageFlowMainBoxId}>
                {props.children}
            </Box>
            {isLoggedIn && <Box sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                anchor: "left",
                // Center the button vertically by subtracting the height of the top menu twice
                // (once for the top and once for the bottom).
                height: `calc(100% - ${Constants.topMenuHeight * 2.5}px)`,
                position: "absolute"
            }}>
                <Tooltip title={isDrawerOpen ? "Close campaign list" : "Open campaign list"}
                    sx={{
                        position: "absolute",
                        display: "block"
                    }}
                >
                    <IconButton color={"primary"} sx={{
                        position: "absolute",
                        // Using negative margin to offset the padding of the Box,
                        // so that the button sticks to the left.
                        marginLeft: `${-Constants.muiBoxDefaultPadding}px`,
                        display: "block",
                    }}
                    onClick={() => {
                        if (isDrawerOpen) {
                            Events.dispatch(Events.EventNames.LeftDrawerClosed);
                        } else {
                            Events.dispatch(Events.EventNames.LeftDrawerOpened);
                        }
                    }}
                    >
                        {
                            isDrawerOpen ?
                                <ChevronLeft/> :
                                <ChevronRight/>
                        }
                    </IconButton>
                </Tooltip>
            </Box>}
        </Main>
    );
}

export default memo(DrawerPageFlow);
