import React from "react";
import {Alert, Avatar, Stack, Typography} from "@mui/material";
import Campaign from "../../models/campaign";
import {ScheduleComponent, ViewsDirective, ViewDirective, MonthAgenda, Inject} from "@syncfusion/ej2-react-schedule";
import {extend} from "@syncfusion/ej2-base";
import dataSource from "./datasource.json";

interface DashboardPageProps {
    campaign: Campaign | null;
}

function DashboardPage(props: DashboardPageProps): JSX.Element {

    const data: Record<string, any>[] = extend([], (dataSource as Record<string, any>).fifaEventsData,
        undefined, true) as Record<string, any>[];


    return (
        <Stack sx={{
            height: "100%",
            width: "100%",
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
                    <div className='schedule-control-section'>
                        <div className='col-lg-12 control-section'>
                            <div className='control-wrapper schedule-wrapper'>
                                <ScheduleComponent width='100%' height='510px'
                                    selectedDate={new Date(2021, 5, 20)}
                                    eventSettings={{ dataSource: data }}>
                                    <ViewsDirective>
                                        <ViewDirective option='MonthAgenda' />
                                    </ViewsDirective>
                                    <Inject services={[MonthAgenda]} />
                                </ScheduleComponent>
                            </div>
                        </div>
                    </div>
                </>
            }
        </Stack>
    );
}

export default DashboardPage;
