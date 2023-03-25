import React from "react";
import PublishedEventWithPublisher from "../models/published-event-with-publisher";
import {Avatar, Card, CardActions, CardContent, CardHeader, Collapse, ListItem, Typography} from "@mui/material";
import Constants from "../utils/constants";
import {Link} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import {toDdMmYyyy, toDdMmYyyyHhMm} from "../utils/date-converter";
import EventIcon from "@mui/icons-material/Event";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreButton from "./ExpandMoreButton";

interface EventCardProps {
    event: PublishedEventWithPublisher;
}
function EventCard(props: EventCardProps): JSX.Element {
    const [expanded, setExpanded] = React.useState(false);

    let publisherName: string = props.event.displayNameEng ?? "";

    if (props.event.firstNameHeb !== null) {
        publisherName = props.event.firstNameHeb + " " + props.event.lastNameHeb;
    }

    return (
        <ListItem>
            <Card sx={{
                width: "100%",
            }}>
                <CardHeader
                    avatar={
                        <Avatar alt={props.event.campaignName} src={props.event.campaignLogoUrl}/>
                    }
                    title={<Link to={`${ScreenRoutes.PublicEventPage}${props.event.eventGuid}`}>
                        {props.event.eventName}</Link>}
                    subheader={`Published by ${publisherName} on ${toDdMmYyyy(props.event.publishingDate)}`}
                    action={
                        <EventIcon/>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {props.event.eventDescription}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <ExpandMoreButton
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label="show more"
                        expand={expanded}
                        sx={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "right",
                            },
                        }}
                    >
                        <ExpandMoreIcon/>
                    </ExpandMoreButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{
                    whiteSpace: "pre-line",
                    marginLeft: `${Constants.muiBoxDefaultPadding}px`,
                    marginRight: `${Constants.muiBoxDefaultPadding}px`,
                }}>
                    <Typography paragraph>
                        Location: {props.event.eventLocation} <br/>
                        Start time: {toDdMmYyyyHhMm(props.event.eventStartTime)} <br/>
                        End time: {toDdMmYyyyHhMm(props.event.eventEndTime)} <br/>
                        Max attendees: {props.event.maxAttendees} <br/>
                        Current attendees: {props.event.numAttending}
                    </Typography>
                </Collapse>
            </Card>
        </ListItem>
    );
}

export default EventCard;
