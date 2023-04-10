import React from "react";
import {Fab, Tooltip} from "@mui/material";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import CloseIcon from "@mui/icons-material/Close";

interface CloseTabButtonProps {
    closeFunction: (tab: string) => void;
    tabName: string;
}

function CloseTabButton(props: CloseTabButtonProps): JSX.Element {
    return (
        <Tooltip title={"Close tab"}>
            <Fab sx={{
                position: "fixed",
                top: `${Constants.topMenuHeight + 4}px`,
                right: `${Constants.rightDrawerWidth + 20}px`,
                zIndex: 1,
            }} size={"small"} color={"primary"} onClick={() => props.closeFunction(props.tabName)}>
                <CloseIcon/>
            </Fab>
        </Tooltip>
    );
}

export default CloseTabButton;

