import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import Job from "../../../../../models/job";
import {JobAssignment} from "../../../../../models/jobAssignment";
import EditIcon from "@mui/icons-material/Edit";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import {useParams} from "react-router-dom";
import axios from "axios";
import {DeleteDialog} from "../../../FinancialPage/DeleteDialog";

interface AssignmentDialogProps {
    isOpen: boolean;
    job: Job | null;
    assignment: JobAssignment | null;
    fetch: () => Promise<void>;
    close: () => void;
}

export const AssignmentDialog = (props: AssignmentDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [salary, setSalary] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [sendNotificationOnDelete, setSendNotificationOnDelete] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (props.assignment === null) {
            return;
        }
        setSalary(props.assignment.salary || 0);
    }, [props.assignment]);

    const update = async () => {
        setIsEditing(false);
        if (props.job === null || props.assignment === null) {
            return;
        }

        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.UpdateJobAssignment +
            campaignGuid + "/" + props.job.jobGuid,
            {
                UserEmail: props.assignment.email,
                Salary: salary,
            },
        );
        await props.fetch();
        props.close();
    };
    const remove = async () => {
        if (props.job === null || props.assignment === null) {
            return;
        }

        const res = await axios.delete(
            config.ServerBaseUrl + config.ControllerUrls.Jobs.Base +
            config.ControllerUrls.Jobs.UnassignJob +
            campaignGuid + "/" + props.job.jobGuid, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                data: {
                    UserEmail: props.assignment.email,
                    Salary: salary,
                },
                params: {
                    sendNotification: sendNotificationOnDelete,
                },
            },
        );

        await props.fetch();
        props.close();
    };

    return (
        <>
            <DeleteDialog switchMode={() => setIsDeleteDialogOpen(false)} action={remove} values={""}
                          isOpen={isDeleteDialogOpen}>
                <FormControlLabel label="Send Notification"
                                  control={
                                      <Switch
                                          aria-label={"hekk"}
                                          checked={sendNotificationOnDelete}
                                          onChange={(e) => setSendNotificationOnDelete(e.target.checked)}
                                          color="primary"
                                      />
                                  }
                />
            </DeleteDialog>
            <Dialog open={props.isOpen} onClose={props.close}>
                <DialogTitle justifyContent={"center"} alignItems="center">
                    <Stack justifyContent="center" display="flex" alignItems="center">
                        <Avatar src={props.assignment?.profilePicUrl ?? ""} alt={props.assignment?.displayNameEng} sx={{
                            height: "112px",
                            width: "112px",
                        }}/>
                        <Typography variant={"h6"}>{props.assignment?.displayNameEng}</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="First name"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant={"filled"}
                                defaultValue={props.assignment?.firstNameHeb ?? ""}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Last name"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant={"filled"}
                                defaultValue={props.assignment?.lastNameHeb ?? ""}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Email"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant={"filled"}
                                defaultValue={props.assignment?.email ?? ""}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                label="Phone Number"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant={"filled"}
                                defaultValue={props.assignment?.phoneNumber ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Salary"
                                type={"number"}
                                fullWidth
                                InputProps={{
                                    readOnly: !isEditing,
                                    endAdornment: <EditIcon onClick={() => setIsEditing((prev) => !prev)}
                                                            sx={{cursor: "pointer"}}/>,
                                }}
                                value={salary}
                                onChange={(e) => setSalary(Number(e.target.value))}
                            />
                        </Grid>
                    </Grid>
                    </DialogContent>
                <DialogActions>
                    <Box>
                        <Button onClick={props.close}>Close</Button>
                        <Button onClick={update} disabled={!isEditing}>Update</Button>
                        <Button onClick={() => setIsDeleteDialogOpen(true)}>Unassign</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};