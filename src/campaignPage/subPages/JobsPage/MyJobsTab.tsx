import React, {useEffect, useState} from "react";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import Job from "../../../models/job";
import {useParams} from "react-router-dom";
import {List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";


export const MyJobsTab = () => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [myJobs, setMyJobs] = useState<Job[] | null>(null);

    const getMyJobs = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.GetSelfJobs,
        );
        const types = res.data as Job[];
        setMyJobs(types);
    };

    useEffect(() => {
        getMyJobs();
    }, []);


    let body: JSX.Element | JSX.Element[];
    if (myJobs === null) {
        body = <Typography>Loading</Typography>;
    } else if (myJobs.length === 0) {
        body = <Typography> you have no tasks :)</Typography>;
    } else {
        body = (
            myJobs.map((type, i) =>
                <Tooltip key={type.jobName} title={`${type.jobStartTime}-${type.jobEndTime}`}>
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
            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    My Tasks
                </Typography>
            </Stack>
            <List>
                {body}
            </List>
        </>
    );
};
