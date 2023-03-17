import React, {useEffect} from "react";
import Constants from "./constants";
import {styled} from "@mui/material";
import Events from "./events";

interface DrawerPageFlowProps {
    children: JSX.Element;
}

function DrawerPageFlow(props: DrawerPageFlowProps): JSX.Element {

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    useEffect(() => {
        Events.subscribe(Events.EventNames.LeftDrawerOpened, () => {
            setIsDrawerOpen(true);
        });

        Events.subscribe(Events.EventNames.LeftDrawerClosed, () => {
            setIsDrawerOpen(false);
        });
    });

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
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    return (
        <Main open={isDrawerOpen}
            sx={{
                ... (isDrawerOpen ? {marginLeft: `${Constants.drawerWidth}px`} : {marginLeft: "$0px"})
            }}
        >
            {props.children}
        </Main>
    );
}

export default DrawerPageFlow;
