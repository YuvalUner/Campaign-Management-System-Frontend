import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import {JobType} from "../../../../models/jobType";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";

interface AddDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    fetch: () => Promise<void>;
    types: JobType[] | null;
}


export const AddDialog = (props: AddDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [jobName, setJobName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [jobDefaultSalary, setJobDefaultSalary] = useState(0);
    const [peopleNeeded, setPeopleNeeded] = useState(0);
    const [jobTypeName, setJobTypeName] = useState("");

    const [jobNameError, setJobNameError] = useState(false);
    const [jobDescriptionError, setJobDescriptionError] = useState(false);
    const [jobLocationError, setJobLocationError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [jobDefaultSalaryError, setJobDefaultSalaryError] = useState(false);
    const [peopleNeededError, setPeopleNeededError] = useState(false);
    const [jobTypeNameError, setJobTypeNameError] = useState(false);

    const add = async () => {
        console.dir(typeof (startTime));
        if (
            jobName === "" ||
            jobDescription === "" ||
            jobLocation === "" ||
            startTime === null || startTime === undefined ||
            endTime === null || endTime === undefined ||
            jobDefaultSalary === null ||
            peopleNeeded === null ||
            jobTypeName === ""
        ) {
            return;
        }
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.AddJob +
            campaignGuid,
            {
                jobName,
                jobDescription,
                jobLocation,
                JobStartTime: startTime,
                JobEndTime: endTime,
                jobDefaultSalary,
                peopleNeeded,
                peopleAssigned: 0,
                jobTypeName,
            },
        );
        await props.fetch();
        props.switchMode();
    };

    return (
        <Dialog open={props.isOpen} onClose={props.switchMode}>
            <DialogTitle>Add Transaction Type</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label="Job Name"
                            required
                            fullWidth
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label="Job Location"
                            fullWidth
                            required
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            label="Job Description"
                            fullWidth
                            required
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePickerComponent value={startTime} floatLabelType="Auto"
                            placeholder="Enter start date"
                            change={(arg) => setStartTime(arg.value)}/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePickerComponent value={endTime} floatLabelType="Auto" placeholder="Enter end date"
                            change={(arg) => setEndTime(arg.value)}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label="Job Default Salary"
                            type="number"
                            fullWidth
                            required
                            value={jobDefaultSalary}
                            onChange={(e) => setJobDefaultSalary(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label="People Needed"
                            type="number"
                            fullWidth
                            required
                            value={peopleNeeded}
                            onChange={(e) => setPeopleNeeded(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense">
                            <InputLabel required>Job Type</InputLabel>
                            <Select
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
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={add}>Confirm</Button>
                <Button fullWidth onClick={props.switchMode}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};
