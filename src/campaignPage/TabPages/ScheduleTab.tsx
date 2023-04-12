import React, {useContext} from "react";
import {Box} from "@mui/material";
import Campaign from "../../models/campaign";
import {
    ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month,
    Inject, Resize, DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import {DrawerOpenContext} from "../../sideMenu/SideMenu";
import TabPageBaseProps from "../utils/tab-page-base-props";
import CloseTabButton from "../utils/CloseTabButton";

interface DashboardPageProps extends TabPageBaseProps{
    campaign: Campaign | null;
}

/**
 * The ScheduleTab component is the tab that displays the personal schedule of the user within a campaign.
 * It should be a child of the CampaignPage component, and is meant to be one of the tabs that can be opened.
 */
function ScheduleTab(props: DashboardPageProps): JSX.Element {

    const drawerOpen = useContext(DrawerOpenContext);

    return (
        <Box>
            <CloseTabButton closeFunction={props.closeFunction} tabName={props.name}/>
            <ScheduleComponent  style={{
                height: "100%",
                width: `calc(100% - ${Constants.rightDrawerWidth} - ${drawerOpen ? Constants.leftDrawerWidth : 0})px`,
                marginRight: `${Constants.rightDrawerWidth}px`,
                marginTop: `${Constants.muiBoxDefaultPadding / 2}px`,
            }}
            allowDragAndDrop={false} allowKeyboardInteraction={false} allowResizing={false}
            firstDayOfWeek={0} readonly={true} selectedDate={new Date()} workDays={[0, 1, 2, 3, 4]}
            >
                <ViewsDirective>
                    <ViewDirective option="Day"/>
                    <ViewDirective option="Week"/>
                    <ViewDirective option="WorkWeek"/>
                    <ViewDirective option="Month"/>
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]}/>
            </ScheduleComponent>
        </Box>
    );
}

export default ScheduleTab;
