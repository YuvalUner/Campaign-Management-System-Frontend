import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import Job from "../../../../../models/job";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import {useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {HttpStatusCode, isAxiosError} from "axios";

interface AddPeopleDialogProps {
    isOpen: boolean;
    job: Job | null;
    fetch: () => Promise<void>;
    close: () => void;
}

export const AddPeopleDialog = (props: AddPeopleDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;


    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [salary, setSalary] = useState(0);
    const [sendNotification, setSendNotification] = useState(false);

    const handleSubmit = async () => {
        if (props.job === null || email === null) {
            return;
        }

        try {
            const res = await ServerRequestMaker.MakePostRequest(
                config.ControllerUrls.Jobs.Base +
                config.ControllerUrls.Jobs.AssignJob +
                campaignGuid + "/" + props.job.jobGuid,
                {
                    UserEmail: email,
                    Salary: salary,
                },
                null,
                {
                    sendNotification,
                },
            );
            await props.fetch();
            props.close();
        } catch (reason) {
            if (isAxiosError(reason)) {
                if (reason.response?.status === HttpStatusCode.NotFound) {
                    setEmailError(true);
                }
            } else {
                throw reason;
            }
        }
    };


    return (
        <Dialog open={props.isOpen} onClose={props.close}>
            <DialogTitle>
                Assign Task
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        margin="dense"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        error={emailError}
                        helperText={emailError ? "email is incorrect" : ""}
                    />

                    <TextField
                        margin="dense"
                        type="number"
                        label="Salary"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        fullWidth
                        required
                    />
                    <FormControlLabel label="Send Notification"
                        control={
                            <Switch
                                aria-label={"Send Notification"}
                                checked={sendNotification}
                                onChange={(e) => setSendNotification(e.target.checked)}
                                color="primary"
                            />
                        }
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button fullWidth onClick={handleSubmit} endIcon={<AddIcon/>}>Add</Button>
                <Button fullWidth onClick={props.close}>Close</Button>
            </DialogActions>
        </Dialog>

    );
};
