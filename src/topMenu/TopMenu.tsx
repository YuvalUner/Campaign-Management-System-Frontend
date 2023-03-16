import React from "react";
import LogIn from "./LogIn";
import {AppBar, Box, Button, Toolbar} from "@mui/material";
import Logout from "./Logout";

interface TopMenuProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function TopMenu(props: TopMenuProps): JSX.Element {
    return (
        <Box>
            <AppBar position={"static"}>
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Box>
                        <Button color={"inherit"}>Home</Button>
                    </Box>
                    <Box>
                        {props.isLoggedIn ?
                            <Logout setIsLoggedIn={props.setIsLoggedIn}/>
                            : <LogIn setIsLoggedIn={props.setIsLoggedIn}/>}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopMenu;
