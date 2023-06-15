import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import {JobType} from "../../../../models/jobType";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {useParams} from "react-router-dom";
import Job from "../../../../models/job";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Sync";
import EditIcon from "@mui/icons-material/Edit";
import {DeleteDialog} from "../../FinancialPage/DeleteDialog";
import {JobAssignment} from "../../../../models/jobAssignment";
import AddIcon from "@mui/icons-material/Add";
import {AddPeopleDialog} from "./AssignPeople/AddPeopleDialog";
import {AssignmentDialog} from "./AssignPeople/AssignmentDialog";

interface JobDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    fetch: () => Promise<void>;
    types: JobType[] | null;
    currentJob: Job | null;
}


export const JobDialog = (props: JobDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [assignedPeople, setAssignedPeople] = useState<JobAssignment[] | null>(null);
    
    const [assignmentDialog, setAssignmentDialog] = useState<JobAssignment | null>(null);
    const [deleteDialogData, setDeleteDialogData] = useState<string | null>(null);
    const [addPeopleDialog, setAddPeopleDialog] = useState(false);

    const [jobName, setJobName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [jobDefaultSalary, setJobDefaultSalary] = useState(0);
    const [peopleNeeded, setPeopleNeeded] = useState(0);
    const [jobTypeName, setJobTypeName] = useState("");
    const [editMode, setEditMode] = useState(false);

    const update = async () => {
        if (
            jobName === "" ||
            jobDescription === "" ||
            jobLocation === "" ||
            startTime === null ||
            endTime === null ||
            jobDefaultSalary === null ||
            peopleNeeded === null ||
            jobTypeName === "" ||
            props.currentJob === null
        ) {
            return;
        }
        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.UpdateJob +
            campaignGuid + "/" + props.currentJob.jobGuid,
            {
                jobName,
                jobDescription,
                jobLocation,
                JobStartTime: startTime,
                JobEndTime: endTime,
                jobDefaultSalary,
                peopleNeeded,
                jobTypeName,
            },
        );
        await props.fetch();
        setEditMode(false);
    };

    const getAssigned = async () => {
        if (props.currentJob === null) {
            return;
        }

        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.GetJobAssignments +
            campaignGuid + "/" + props.currentJob.jobGuid,
        );
        const people = res.data as JobAssignment[];
        setAssignedPeople(people);
    };

    const onDelete = async () => {
        if (props.currentJob === null) {
            return;
        }

        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.DeleteJob +
            campaignGuid + "/" + props.currentJob.jobGuid,
        );
        await props.fetch();
        props.switchMode();
    };

    useEffect(() => {
        if (props.currentJob === null) {
            return;
        }
        setJobName(props.currentJob.jobName ?? "");
        setJobDescription(props.currentJob.jobDescription ?? "");
        setJobLocation(props.currentJob.jobLocation ?? "");
        setStartTime(props.currentJob.jobStartTime ?? "");
        setEndTime(props.currentJob.jobEndTime ?? "");
        setJobDefaultSalary(props.currentJob.jobDefaultSalary ?? 0);
        setPeopleNeeded(props.currentJob.peopleNeeded ?? 0);
        setJobTypeName(props.currentJob.jobTypeName ?? "");
        getAssigned();
    }, [props.currentJob]);

    let peopleJSX: JSX.Element | JSX.Element[];
    if (assignedPeople === null) {
        peopleJSX = <Typography>Loading</Typography>;
    } else if (assignedPeople.length === 0) {
        peopleJSX = <Typography>no one is assigned</Typography>;
    } else {
        peopleJSX = (
            assignedPeople.map((people, i) =>
                <Tooltip title={`Salary: ${people.salary}$`} key={people.email}>
                    <Chip
                        avatar={<Avatar alt={people.displayNameEng} src={people.profilePicUrl}/>}
                        label={people.displayNameEng}
                        variant="outlined"
                        onClick={() => setAssignmentDialog(people)}
                    />
                </Tooltip>,
            )
        );
    }
    const onAssignment = async () => {
        getAssigned();
        props.fetch();
    };

    return (
        <>
            <AssignmentDialog isOpen={assignmentDialog !== null} job={props.currentJob} assignment={assignmentDialog}
                fetch={onAssignment} close={() => setAssignmentDialog(null)}/>
            <AddPeopleDialog job={props.currentJob} fetch={getAssigned} close={() => setAddPeopleDialog(false)}
                isOpen={addPeopleDialog}/>
            <DeleteDialog values={deleteDialogData} switchMode={() => setDeleteDialogData(null)} action={onDelete}/>
            <Dialog open={props.isOpen} onClose={props.switchMode}>
                <DialogTitle>
                    <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                        <Typography variant="h5" sx={{flexGrow: "1"}}>
                            Task
                        </Typography>
                        <IconButton aria-label="edit" onClick={() => setEditMode((prev) => !prev)}>
                            <EditIcon color={editMode ? "primary" : undefined}/>
                        </IconButton>
                        <IconButton aria-label="delete"
                            onClick={() => setDeleteDialogData("are you sure you want to delete?")}>
                            <DeleteIcon/>
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Job Name"
                                fullWidth
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Job Location"
                                fullWidth
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                                value={jobLocation}
                                onChange={(e) => setJobLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Job Description"
                                fullWidth
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePickerComponent value={new Date(startTime)} floatLabelType="Auto"
                                placeholder="Enter start date"
                                change={(arg) => setStartTime(arg.value)}
                                readonly={!editMode}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePickerComponent value={new Date(endTime)}
                            floatLabelType="Auto"
                            placeholder="Enter end date"
                                change={(arg) => setEndTime(arg.value)}
                                readonly={!editMode}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Job Default Salary"
                                type="number"
                                fullWidth
                                value={jobDefaultSalary}
                                onChange={(e) => setJobDefaultSalary(Number(e.target.value))}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="People Needed"
                                type="number"
                                fullWidth
                                value={peopleNeeded}
                                onChange={(e) => setPeopleNeeded(Number(e.target.value))}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel aria-readonly={!editMode}>Job Type</InputLabel>
                                <Select inputProps={{readOnly: !editMode}}
                                    label="Job Type"
                                    value={jobTypeName}
                                    onChange={(e) => setJobTypeName(e.target.value)}>
                                    {props.types?.map((type) => (
                                        <MenuItem value={type.jobTypeName} key={type.jobTypeName}>
                                            <Tooltip title={type.jobTypeDescription} placement="right-start">
                                                <div style={{width: "100%"}}>
                                                    {type.jobTypeName}
                                                </div>
                                            </Tooltip>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={11}>
                                    <Stack direction={"row"} spacing={1}
                                           sx={{display: "flex", justifyContent: "left", overflow: "auto"}}>
                                        {peopleJSX}
                                    </Stack>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton aria-label="add" onClick={() => setAddPeopleDialog(true)}>
                                        <AddIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={update} endIcon={<UpdateIcon/>} disabled={!editMode}>Update</Button>
                    <Button fullWidth onClick={props.switchMode}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
