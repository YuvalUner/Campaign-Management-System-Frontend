import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import {useParams} from "react-router-dom";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {DeleteDialog} from "../FinancialPage/DeleteDialog";
import {IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import {Button} from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Sync";
import CircleIcon from "@mui/icons-material/Circle";
import {builtInTypesNames, JobType} from "../../../models/jobType";
import AddJobTypeDialog from "./AddJobTypeDialog";
import UpdateJobTypeDialog from "./UpdateJobTypeDialog";
import {builtInRoleNames} from "../../../models/role";

interface JobTypesPageProps {
    campaign: Campaign | null;
}

export const JobTypesPage = (props: JobTypesPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [jobsTypes, setJobsTypes] = useState<JobType[] | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogData, setDeleteDialogData] = useState<string | null>(null);
    const [updateDialogData, setUpdateDialogData] = useState<JobType | null>(null);

    const switchAddTransactionTypeMode = () => {
        setIsAddDialogOpen((prev) => !prev);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogData(null);
    };

    const closeUpdateDialog = () => {
        setUpdateDialogData(null);
    };

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

    const onDeleteIconClick = async (JobTypeName: string) => {
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.JobType.Base +
            config.ControllerUrls.JobType.DeleteJobType +
            `${campaignGuid}/${JobTypeName}`,
        );
        await getJobTypes();
    };

    return (
        <>
            <UpdateJobTypeDialog type={updateDialogData} closeDialog={closeUpdateDialog}
                fetch={getJobTypes}/>
            <AddJobTypeDialog switchMode={switchAddTransactionTypeMode}
                fetch={getJobTypes}
                isOpen={isAddDialogOpen}/>
            <DeleteDialog values={deleteDialogData} switchMode={closeDeleteDialog} action={onDeleteIconClick}/>

            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    Tasks Types
                </Typography>
                <Button onClick={switchAddTransactionTypeMode}>Add Type <AddIcon/></Button>
            </Stack>
            <List>
                {jobsTypes?.map((type, i) =>
                    <ListItem key={type.jobTypeName} secondaryAction={
                        !builtInTypesNames.includes(type.jobTypeName ?? "") ? <Stack direction="row" spacing={2}>
                            <IconButton aria-label="delete"
                                onClick={() => setDeleteDialogData(type.jobTypeName ?? "")}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton aria-label="update"
                                onClick={() => setUpdateDialogData(type)}>
                                <UpdateIcon/>
                            </IconButton>
                        </Stack> : null
                    }>
                        <ListItemIcon>
                            <CircleIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={type.jobTypeName}
                            secondary={type.jobTypeDescription}
                        />
                    </ListItem>,
                )}
            </List>
        </>
    );
};
