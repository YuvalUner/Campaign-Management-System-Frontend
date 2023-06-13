import React, {useEffect, useState} from "react";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import Job from "../../../../models/job";
import {List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";
import {AddDialog} from "./AddDialog";
import {JobType} from "../../../../models/jobType";
import {JobDialog} from "./JobDialog";
import {format, parseISO} from "date-fns";
import {FilterDialog} from "./FilterDialog";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface AllJobsTabProps {
    types: JobType[] | null;
}


export const AllJobsTab = (props: AllJobsTabProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [allJobs, setAllJobs] = useState<Job[] | null>(null);

    const [addDialog, setAddDialog] = useState<boolean>(false);
    const [filterDialog, setFilterDialog] = useState<boolean>(false);
    const [jobDialog, setJobDialog] = useState<Job | null>(null);

    const getAllJobs = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.GetJobs +
            campaignGuid,
        );
        const jobs = res.data as Job[];
        setAllJobs(jobs);
    };

    useEffect(() => {
        getAllJobs();
    }, []);

    let jobsList: JSX.Element | JSX.Element[];
    if (allJobs === null) {
        jobsList = <Typography>Loading</Typography>;
    } else if (allJobs.length === 0) {
        jobsList = <Typography> no jobs</Typography>;
    } else {
        jobsList = (
            allJobs.map((job, i) => {
                let tooltip: string;
                if (job.jobStartTime === undefined || job.jobEndTime === undefined) {
                    tooltip = "";
                } else {
                    tooltip = `from ${format(parseISO(job.jobStartTime), "PPpp")} to ${format(parseISO(job.jobEndTime), "PPpp")}`;
                }
                return (
                    <Tooltip key={job.jobGuid} title={tooltip}
                             onClick={() => setJobDialog(job)}>
                        <ListItem>
                            <ListItemIcon>
                                <CircleIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={`${job.jobName} (${job.peopleAssigned}/${job.peopleNeeded})`}
                                secondary={`${job.jobDescription} on ${job.jobLocation}`}
                            />
                        </ListItem>
                    </Tooltip>
                );
            })
        );
    }

    return (
        <>
            <FilterDialog isOpen={filterDialog} close={() => setFilterDialog(false)} setter={setAllJobs}
                          reset={getAllJobs} types={props.types}/>
            <AddDialog isOpen={addDialog} switchMode={() => setAddDialog(false)} fetch={getAllJobs}
                       types={props.types}/>
            <JobDialog isOpen={jobDialog !== null} switchMode={() => setJobDialog(null)}
                       fetch={getAllJobs}
                       types={props.types} currentJob={jobDialog}/>
            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    All Tasks
                </Typography>
                <Button onClick={() => setFilterDialog(true)} endIcon={<FilterAltIcon/>} variant="contained" >Filter</Button>
                <Button onClick={() => setAddDialog(true)} endIcon={<AddIcon/>} variant="contained" >Add Transaction</Button>            </Stack>
            <List>
                {jobsList}
            </List>
        </>
    );
};
