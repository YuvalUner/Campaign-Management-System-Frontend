import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import Job from "../../../models/job";
import {JobType} from "../../../models/jobType";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import {Box, Tab, Tabs} from "@mui/material";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import FilterListIcon from "@mui/icons-material/FilterList";
import GraphIcon from "@mui/icons-material/Timeline";
import TabPanel from "../../utils/TabPanel";
import {MyJobsTab} from "./MyJobsTab";
import {AllJobsTab} from "./AllJobsTab";

interface JobsPageProps {
    campaign: Campaign | null;
}

export const JobsPage = (props: JobsPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [currentTab, setCurrentTab] = useState(0);

    const [jobsTypes, setJobsTypes] = useState<JobType[] | null>(null);

    const getJobTypes = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.JobType.Base +
            config.ControllerUrls.JobType.GetJobTypes +
            campaignGuid,
        );
        const types = res.data as JobType[];
        setJobsTypes(types);
    };

    useEffect(() => {
        getJobTypes();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <>
            <Box sx={{width: "100%", height: `calc(100% - ${Constants.topMenuHeight}px)`}}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab icon={<ListIcon/>} label="My Jobs" value={0}/>
                        <Tab icon={<FilterListIcon/>} label="Transaction Types" value={1}/>
                        <Tab icon={<GraphIcon/>} label="Balance" value={2}/>
                    </Tabs>
                </Box>
                <TabPanel value={currentTab} index={0}>
                    <MyJobsTab/>
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                    <AllJobsTab types={jobsTypes}/>
                </TabPanel>
            </Box>
        </>
    );
};
