import React, {useEffect, memo, useContext} from "react";
import Constants from "./constantsAndStaticObjects/constants";
import {Box, IconButton, Tooltip} from "@mui/material";
import Events from "./events";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import componentIds from "./constantsAndStaticObjects/component-ids";
import {UserLoggedInContext} from "../App";

interface DrawerPageFlowProps {
    children: JSX.Element;
}

/**
 * A helper component, meant to manage the page flow when the left drawer is open or closed.
 * @param props
 * @constructor
 */
function DrawerPageFlow(props: DrawerPageFlowProps): JSX.Element {

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const isLoggedIn = useContext(UserLoggedInContext);


    useEffect(() => {
        // Listen to the drawer opening and closing
        Events.subscribe(Events.EventNames.LeftDrawerOpened, () => {
            setIsDrawerOpen(true);
        });

        Events.subscribe(Events.EventNames.LeftDrawerClosed, () => {
            setIsDrawerOpen(false);
        });
    }, []);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: `calc(100% - ${Constants.topMenuHeight}px)`,
            paddingBottom: "px",
            marginLeft: isDrawerOpen ? `${Constants.leftDrawerWidth}px` : "0px",
        }}>
            <Box sx={{
                // Negative margin used to prevent the content from ending too close to the top menu.
                marginBottom: `${-Constants.muiBoxDefaultPadding}px`,
                overflow: "auto",
                marginLeft: isLoggedIn ? `${Constants.muiBoxDefaultPadding}px` : "0px",
                height: "100%",
            }} id={componentIds.DrawerPageFlowMainBoxId}>
                {/* The whole application is here */}
                {props.children}
            </Box>
            {isLoggedIn && <Box sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                anchor: "left",
                // Center the button vertically by subtracting the height of the top menu twice
                // (once for the top and once for the bottom).
                height: `calc(100% - ${Constants.topMenuHeight * 2}px)`,
                position: "absolute",
            }}>
                <Tooltip title={isDrawerOpen ? "Close campaign list" : "Open campaign list"}
                    sx={{
                        position: "absolute",
                        display: "block",
                        // Using negative margin to offset the padding of the Box,
                        // so that the button sticks to the left.
                        marginLeft: `${-Constants.muiBoxDefaultPadding}px`,
                    }}
                >
                    {/* The button for closing and opening the drawer */}
                    <IconButton color={"primary"} sx={{
                        position: "absolute",
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
        </Box>
    );
}

export default memo(DrawerPageFlow);
