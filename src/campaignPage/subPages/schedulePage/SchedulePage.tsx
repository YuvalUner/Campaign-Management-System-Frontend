import React from "react";
import {Box} from "@mui/material";
import Campaign from "../../../models/campaign";
import {
    ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month,
    Inject, Resize, DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import Constants from "../../../utils/constantsAndStaticObjects/constants";

interface SchedulePageProps {
    campaign: Campaign | null;
}

/**
 * The SchedulePage component is the tab that displays the personal schedule of the user within a campaign.
 * It should be a child of the CampaignPage component, and is meant to be one of the tabs that can be opened.
 */
function SchedulePage(props: SchedulePageProps): JSX.Element {

    return (
        <Box>
            <ScheduleComponent  style={{
                height: "100%",
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

export default SchedulePage;
