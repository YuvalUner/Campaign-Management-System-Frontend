import React, {useEffect} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import Ballot from "../models/ballot";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import {Link} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import {Status, Wrapper} from "@googlemaps/react-wrapper";
import Map from "./Map";

function PersonalBallotPage(): JSX.Element {

    const [ballot, setBallot] = React.useState<Ballot>({
        cityName: "",
        innerCityBallotId: -1,
        accessible: false,
        ballotAddress: "",
        ballotLocation: "",
    });
    const [responseStatus, setResponseStatus] = React.useState<number>(0);

    useEffect(() => {
        GenericRequestMaker.MakeGetRequest(
            config.ControllerUrls.ElectionDay.Base + config.ControllerUrls.ElectionDay.GetSelfBallot,
        ).then((response) => {
            if (response.status === HttpStatusCode.Ok) {
                setBallot(response.data);
            }
            setResponseStatus(response.status);
        }).catch((error) => {
            setResponseStatus(error.response.status);
        });
    }, []);

    const renderNotAuthenticatedError = () => {
        return (
            <Box sx={{
                alignSelf: "center",
                justifySelf: "center",
            }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    You must be verified to access this feature. Verify <Link to={ScreenRoutes.ProfilePage}>here</Link>
                </Typography>
            </Box>
        );
    };

    const renderNotFoundError = () => {
        return (
            <Box sx={{
                alignSelf: "center",
                justifySelf: "center",
            }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    We could not find your ballot. Please contact your local election office.
                </Typography>
            </Box>
        );
    };

    const renderGoogleMap = (status: Status) => {
        switch (status) {
        case Status.LOADING:
            return <CircularProgress/>;
        case Status.FAILURE:
            return <div>Failure</div>;
        case Status.SUCCESS:
            return <Box sx={{height: "400px"}}><Map ballot={ballot}/></Box>;
        default:
            return <></>;
        }
    };

    const renderBallotWithMap = (status: Status) => {
        return (
            <Box sx={{
                height: "100%",
            }}>
                <Typography variant={"h3"} component={"h2"} gutterBottom>
                    Your Ballot
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`City: ${ballot.cityName}`}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`Address: ${ballot.ballotAddress}`}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`Location: ${ballot.ballotLocation}`}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`Accessibility: ${ballot.accessible ? "Accessible" : "Not Accessible"}`}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`Ballot number: ${ballot.innerCityBallotId}`}
                </Typography>
                {renderGoogleMap(status)}
            </Box>
        );
    };


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            {responseStatus === HttpStatusCode.Unauthorized && renderNotAuthenticatedError()}
            {responseStatus === HttpStatusCode.NotFound && renderNotFoundError()}
            {responseStatus === HttpStatusCode.Ok &&
                <Wrapper apiKey={config.GoogleMapsApiKey} render={renderBallotWithMap}></Wrapper>
            }
        </Box>
    );
}

export default PersonalBallotPage;