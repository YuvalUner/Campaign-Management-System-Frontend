import React, {useEffect, useState} from "react";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import Job from "../../../models/job";
import {List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import {Button} from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";
import {AddDialog} from "./AddDialog";
import {JobType} from "../../../models/jobType";

interface AllJobsTabProps {
    types: JobType[] | null;
}


export const AllJobsTab = (props:AllJobsTabProps) => {
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
        console.dir(jobs);
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
            allJobs.map((type, i) =>
                <Tooltip key={type.jobGuid} title={`${type.jobStartTime}-${type.jobEndTime}`}>
                    <ListItem>
                        <ListItemIcon>
                            <CircleIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={type.jobName}
                            secondary={`${type.jobDescription} on ${type.jobLocation}`}
                        />
                    </ListItem>
                </Tooltip>,
            )
        );
    }

    return (
        <>
            <AddDialog isOpen={addDialog} switchMode={() => setAddDialog(false)} fetch={getAllJobs} types={props.types}/>
            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    All Tasks
                </Typography>
                <Button onClick={() => setAddDialog(true)}>Add Transaction <AddIcon/></Button>
            </Stack>
            <List>
                {jobsList}
            </List>
        </>
    );
};
