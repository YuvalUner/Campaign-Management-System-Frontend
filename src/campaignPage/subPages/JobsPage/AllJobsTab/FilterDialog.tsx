import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import Job from "../../../../models/job";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {useParams} from "react-router-dom";
import {JobType} from "../../../../models/jobType";


interface FilterDialogProps {
    isOpen: boolean;
    close: () => void;
    setter: React.Dispatch<React.SetStateAction<Job[] | null>>;
    reset: () => Promise<void>;
    types: JobType[] | null;
}

export const FilterDialog = (props: FilterDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;


    const [jobTypeName, setJobTypeName] = useState<string>("");
    const [jobStartTime, setJobStartTime] = useState<string>("");
    const [jobEndTime, setJobEndTime] = useState<string>("");
    const [jobName, setJobName] = useState<string>("");
    const [fullyManned, setFullyManned] = useState<boolean>(false);
    const [jobLocation, setJobLocation] = useState<string>("");

    const filter = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.GetJobsByMannedStatus +
            campaignGuid,
            null,
            {
                jobTypeName, jobStartTime, jobEndTime, jobName, fullyManned, jobLocation,
            },
        );
        const jobs = res.data as Job[];
        props.setter(jobs);
        props.close();
    };

    const reset = () => {
        props.reset();
        props.close();
    };

    return (
        <>
            <Dialog open={props.isOpen} onClose={props.close}>
                <DialogTitle>
                    <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                        <Typography variant="h5" sx={{flexGrow: "1"}}>
                            Filter
                        </Typography>
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
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Job Location"
                                fullWidth
                                value={jobLocation}
                                onChange={(e) => setJobLocation(e.target.value)}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Job Type</InputLabel>
                                <Select
                                    value={jobTypeName}
                                    label="Job Type"
                                    onChange={(e) => setJobTypeName(e.target.value as string)}
                                >
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
                        <Grid item xs={6}>
                            <DateTimePickerComponent value={new Date(jobStartTime)} floatLabelType="Auto"
                                placeholder="Enter start date"
                                change={(arg) => setJobStartTime(arg.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePickerComponent value={new Date(jobEndTime)} floatLabelType="Auto"
                                placeholder="Enter end date"
                                change={(arg) => setJobEndTime(arg.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel label="Fully Assigned"
                                control={
                                    <Switch
                                        checked={fullyManned}
                                        onChange={(e) => setFullyManned(e.target.checked)}
                                        color="primary"
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={filter}>Filter</Button>
                    <Button fullWidth onClick={reset}>Reset</Button>
                    <Button fullWidth onClick={props.close}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
