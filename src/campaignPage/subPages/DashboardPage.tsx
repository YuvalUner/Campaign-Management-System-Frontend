import React from "react";
import {Alert, Avatar, Stack, Typography} from "@mui/material";
import Campaign from "../../models/campaign";
import {
    ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month,
    Inject, Resize, DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import Constants from "../../utils/constantsAndStaticObjects/constants";

interface DashboardPageProps {
    campaign: Campaign | null;
}

function DashboardPage(props: DashboardPageProps): JSX.Element {


    return (
        <Stack sx={{
            height: "100%",
            width: "100%",
            marginLeft: `${Constants.muiBoxDefaultPadding}px`
        }} direction={"column"} spacing={2}>
            {props.campaign === null ?
                <Alert severity={"error"}>Error loading campaign</Alert>
                : <>
                    <Stack direction={"row"} spacing={4} alignItems={"center"}>
                        <Avatar src={props.campaign.campaignLogoUrl ?? ""} alt={props.campaign.campaignName} sx={{
                            height: "112px",
                            width: "112px",
                        }}/>
                        <Typography variant={"h4"}>{props.campaign.campaignName}</Typography>
                    </Stack>
                    <Typography variant={"h5"}>My campaign schedule</Typography>
                    <ScheduleComponent width="80%" height="100%"
                        allowDragAndDrop={false} allowKeyboardInteraction={false} allowResizing={false}
                        firstDayOfWeek={0} readonly={true} selectedDate={new Date()} workDays={[0, 1, 2, 3, 4,]}
                    >
                        <ViewsDirective>
                            <ViewDirective option="Day"/>
                            <ViewDirective option="Week"/>
                            <ViewDirective option="WorkWeek"/>
                            <ViewDirective option="Month"/>
                        </ViewsDirective>
                        <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]}/>
                    </ScheduleComponent>
                </>
            }
        </Stack>
    );
}

export default DashboardPage;
