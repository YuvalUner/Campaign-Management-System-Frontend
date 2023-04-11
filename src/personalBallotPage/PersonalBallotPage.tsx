import React, {useEffect} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import Ballot from "../models/ballot";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import {Link} from "react-router-dom";
import ScreenRoutes from "../utils/constantsAndStaticObjects/screen-routes";
import {Status, Wrapper} from "@googlemaps/react-wrapper";
import Map from "./Map";
import Constants from "../utils/constantsAndStaticObjects/constants";
import Grid2 from "@mui/material/Unstable_Grid2";

/**
 * A page displaying the ballot the user is assigned to.
 * Includes a map of the location of the ballot.
 * @constructor
 */
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
        // Get the ballot assigned to the user.
        ServerRequestMaker.MakeGetRequest(
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

    /**
     * If the user is not authenticated, display a message telling them to verify first.
     */
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

    /**
     * If the user is not assigned a ballot, display a message telling them to contact their local election office,
     * because something went horribly wrong somewhere and we don't know what.
     */
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

    /**
     * If the user is assigned a ballot, display the ballot and a map of the location of the ballot.
     * @param status
     */
    const renderGoogleMap = (status: Status) => {
        switch (status) {
        case Status.LOADING:
            return <CircularProgress/>;
        case Status.FAILURE:
            return <div>Failed to load map</div>;
        case Status.SUCCESS:
            return <Map ballot={ballot}/>;
        default:
            return <></>;
        }
    };

    /**
     * The main part of the page, displaying the ballot and the map.
     * @param status
     */
    const renderBallotWithMap = (status: Status) => {
        return (
            <Grid2 container spacing={2} sx={{
                height: `calc(100% - ${Constants.topMenuHeight}px)`,
                marginRight: `${Constants.muiBoxDefaultPadding}px`,
                marginTop: `${Constants.muiBoxDefaultPadding}px`,
            }}>
                <Grid2 xs={12} md={6}>
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
                </Grid2>
                <Grid2 xs={12} md={6}>
                    {renderGoogleMap(status)}
                    <Typography variant={"caption"} >
                        * Please note that the location displayed on the map is not guaranteed to be the exact location
                        of your ballot.
                    </Typography>
                </Grid2>
            </Grid2>
        );
    };


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            marginLeft: `${Constants.muiBoxDefaultPadding}px`,
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
