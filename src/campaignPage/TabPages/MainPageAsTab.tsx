import React from "react";
import MainPage from "../MainPage";
import Campaign from "../../models/campaign";
import TabPageBaseProps from "../utils/tabPageBaseProps";
import CloseTabButton from "../utils/CloseTabButton";

interface MainPageAsTabProps extends TabPageBaseProps{
    campaign: Campaign | null;
}

/**
 * The MainPageAsTab component is a helper component that allows rendering the MainPage component as a tab.
 */
function MainPageAsTab(props: MainPageAsTabProps): JSX.Element {
    return (
        <>
            <CloseTabButton closeFunction={props.closeFunction} tabName={props.name}/>
            <MainPage campaign={props.campaign}/>
        </>
    );
}

export default MainPageAsTab;
