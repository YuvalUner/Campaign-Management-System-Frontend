import React, {useEffect} from "react";
import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {Link} from "react-router-dom";

function CreateCampaignPage(): JSX.Element {

    const [awaitingAuthStatusVerification, setAwaitingAuthStatusVerification] = React.useState(true);
    const [authStatus, setAuthStatus] = React.useState(false);

    useEffect(() => {
        GenericRequestMaker.MakeGetRequest(
            config.ControllerUrls.Users.Base + config.ControllerUrls.Users.GetVerifiedStatus,
        ).then((res) => {
            setAwaitingAuthStatusVerification(false);
            // Equals operator is used because under very odd (specifically, a server restart) circumstances,
            // the response can be null.
            setAuthStatus(res.data.isVerified === true);
        });
    }, []);

    const renderPage = (): JSX.Element => {
        if (!authStatus){
            return (
                <Typography variant={"h5"}>
                    You must be verified to create a campaign. Please verify <Link to={"/profile"}>here</Link>.
                </Typography>
            );
        }
        return (
            <Stack component={"form"} direction={"row"}>
                <Typography variant={"h4"}>
                    Create a campaign
                </Typography>
            </Stack>
        );
    };

    return (
        <>
            {awaitingAuthStatusVerification && <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
                <CircularProgress/>
            </Box>}
            {!awaitingAuthStatusVerification && renderPage()}
        </>
    );
}

export default CreateCampaignPage;
