import React from "react";
import {Fab, Tooltip} from "@mui/material";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import CloseIcon from "@mui/icons-material/Close";

interface CloseTabButtonProps {
    closeFunction: (tab: string) => void;
    tabName: string;
}

/**
 * The CloseTabButton component is a button that can be used to close a tab.
 * It is an auxiliary component for each tab, that should be included in the beginning of the tab's return statement.
 * @param props the function that should be called when the button is clicked,
 * and the name of the tab that should be closed.
 */
function CloseTabButton(props: CloseTabButtonProps): JSX.Element {
    const handleClick = () => {
        props.closeFunction(props.tabName);
    };

    return (
        <Tooltip title={"Close tab"}>
            <Fab sx={{
                position: "fixed",
                top: `${Constants.topMenuHeight + 4}px`,
                right: `${Constants.rightDrawerWidth + 20}px`,
                zIndex: 1,
            }} size={"small"} color={"primary"} onClick={handleClick}>
                <CloseIcon/>
            </Fab>
        </Tooltip>
    );
}

export default CloseTabButton;

