import React, {useEffect} from "react";
import Events from "../../../../../utils/helperMethods/events";
import {Alert, Box, LinearProgress, Stack, Typography} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

interface FinalStepUploadAndFinishProps {
    ledgerName: string;
    handleLogic: () => void;
    error: boolean;
    uploading: boolean;
}

function FinalStepUploadAndFinish(props: FinalStepUploadAndFinishProps): JSX.Element {

    useEffect(() => {
        props.handleLogic();
    }, []);

    const renderAlert = (): JSX.Element => {
        return (
            <Alert severity={props.error? "error" : "success"} icon={<></>} sx={{
                paddingRight: "25px",
            }}>
                <Stack direction={"column"} spacing={3} alignItems={"center"} justifyContent={"center"}>
                    {props.error? <ClearIcon sx={{
                        fontSize: "70px",
                    }}/> : <DoneIcon sx={{
                        fontSize: "70px",
                    }}/>}
                    <Typography variant={"body2"}>
                        {props.error? "There was an error during the upload. Please check your input and try again" :
                            "Upload complete"}
                    </Typography>
                </Stack>
            </Alert>
        );
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
        }}>
            {props.uploading && <Stack direction={"column"} spacing={3}>
                <Typography variant={"h5"}>Uploading...</Typography>
                <Typography variant={"body1"}>Please wait while we upload your file.</Typography>
                <LinearProgress/>
            </Stack>}
            {!props.uploading && renderAlert()}
        </Box>
    );
}

export default FinalStepUploadAndFinish;
