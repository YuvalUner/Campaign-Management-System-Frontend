import React from "react";
import LogIn from "./LogIn";
import {AppBar, Box, Button, Toolbar} from "@mui/material";

function TopMenu(): JSX.Element {
    return (
        <Box>
            <AppBar position={"static"}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box>
                        <Button color={"inherit"}>Home</Button>
                    </Box>
                    <LogIn/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopMenu;
