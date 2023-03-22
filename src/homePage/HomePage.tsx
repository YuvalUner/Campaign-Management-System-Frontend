import React, {useEffect} from "react";
import HomePageControl from "../models/home-page-control";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import AnnouncementWithPublisherDetails from "../models/announcement-with-publisher-details";
import PublishedEventWithPublisher from "../models/published-event-with-publisher";
import Events from "../utils/events";
import {
    Avatar,
    Card, CardActions,
    CardContent,
    CardHeader, Collapse,
    List,
    ListItem,
    Paper, styled, Typography,
} from "@mui/material";

import Constants from "../utils/constants";
import {toDdMmYyyy, toDdMmYyyyHhMm} from "../utils/date-converter";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import EventIcon from "@mui/icons-material/Event";
import {Link} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";

interface HomePageProps {
    homePageController: HomePageControl;
    setHomePageController: (homePageController: HomePageControl) => void;
}

function HomePage(props: HomePageProps): JSX.Element {

    const maxAnnouncementLength = 150;

    interface ExpandMoreProps extends IconButtonProps {
        expand: boolean;
    }

    const collapseTypographySx = {
        whiteSpace: "pre-line",
        marginLeft: `${Constants.muiBoxDefaultPadding}px`,
        marginRight: `${Constants.muiBoxDefaultPadding}px`,
    };

    const retrieveHomePage = async ():
        Promise<void> => {
        const query = `?limit=${props.homePageController.limit}&offset=${props.homePageController.offset}`;
        const res = await GenericRequestMaker.MakeGetRequest<HomePageControl>(
            config.ControllerUrls.PublicBoard.Base + config.ControllerUrls.PublicBoard.GetPublicBoard + query,
        );
        if (res.status === HttpStatusCode.Ok) {
            const announcements: AnnouncementWithPublisherDetails[] | null = res.data.announcements;
            const events: PublishedEventWithPublisher[] | null = res.data.events;

            let combined: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[] | null = null;

            if (announcements !== null && events !== null && announcements.length > 0 && events.length > 0) {
                combined = announcements.concat(events);
                combined.sort((a, b) => {
                    return a.publishingDate.valueOf() - b.publishingDate.valueOf();
                });
            } else if (announcements !== null && announcements.length > 0) {
                combined = announcements;
            } else if (events !== null && events.length > 0) {
                combined = events;
            }

            props.setHomePageController({
                announcementsAndEvents: props.homePageController.announcementsAndEvents === null ?
                    combined :
                    props.homePageController.announcementsAndEvents.concat(combined === null ? [] : combined),
                limit: props.homePageController.limit,
                offset: props.homePageController.offset + props.homePageController.limit,
            });
        }
    };

    useEffect(() => {
        if (props.homePageController.announcementsAndEvents === null) {
            // eslint-disable-next-line no-console
            retrieveHomePage().catch(console.error);
        }
    }, []);

    useEffect(() => {
        // When the user logs in or out, we want to empty out the home page and then retrieve it again, so that
        // the user can see the announcements and events that are relevant to them.
        Events.subscribe(Events.EventNames.UserLoggedIn, retrieveHomePage);
        Events.subscribe(Events.EventNames.UserLoggedOut, retrieveHomePage);
        return () => {
            Events.unsubscribe(Events.EventNames.UserLoggedIn, retrieveHomePage);
            Events.unsubscribe(Events.EventNames.UserLoggedOut, retrieveHomePage);
        };
    }, []);


    const instanceOfAnnouncementWithPublisherDetails = (object: any): object is AnnouncementWithPublisherDetails => {
        return "announcementGuid" in object;
    };

    const instanceOfPublishedEventWithPublisher = (object: any): object is PublishedEventWithPublisher => {
        return "eventGuid" in object;
    };

    const ExpandMore = styled((props: ExpandMoreProps) => {
        const {expand, ...other} = props;
        return <IconButton {...other} />;
    })(({theme, expand}) => ({
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    const createCardForAnnouncement = (announcement: AnnouncementWithPublisherDetails): JSX.Element => {
        if (announcement.announcementContent === undefined || announcement.announcementTitle === undefined) {
            return (<ListItem key={"a" + announcement.announcementGuid}/>);
        }

        const needsExpansion: boolean = announcement.announcementContent.length > maxAnnouncementLength;
        const announcementContent: string = needsExpansion ?
            announcement.announcementContent.substring(0, maxAnnouncementLength) + "..." :
            announcement.announcementContent;

        const [expanded, setExpanded] = React.useState(false);

        let publisherName: string = announcement.displayNameEng ?? "Unknown";

        if (announcement.firstNameHeb !== null) {
            publisherName = announcement.firstNameHeb + " " + announcement.lastNameHeb;
        }

        return (
            <ListItem key={"a" + announcement.announcementGuid}>
                <Card sx={{
                    width: `calc(100% - ${Constants.muiBoxDefaultPadding * 2}px)`,
                }}>
                    <CardHeader
                        avatar={
                            <Avatar alt={announcement.campaignName} src={announcement.campaignLogoUrl}/>
                        }
                        title={announcement.announcementTitle}
                        subheader={`Published by ${publisherName} on ${toDdMmYyyyHhMm(announcement.publishingDate)}`}
                        action={
                            <AnnouncementIcon/>
                        }
                    />
                    <Collapse in={!expanded} timeout="auto" unmountOnExit sx={collapseTypographySx}>
                        <Typography paragraph>
                            {announcementContent}
                        </Typography>
                    </Collapse>
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={collapseTypographySx}>
                        <Typography paragraph>
                            {announcement.announcementContent}
                        </Typography>
                    </Collapse>
                    <CardActions disableSpacing>
                        <ExpandMore
                            onClick={() => setExpanded(!expanded)}
                            aria-expanded={expanded}
                            aria-label="show more"
                            expand={expanded}
                            sx={{
                                visibility: needsExpansion ? "visible" : "hidden",
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right",
                                },
                            }}
                        >
                            <ExpandMoreIcon/>
                        </ExpandMore>
                    </CardActions>
                </Card>
            </ListItem>
        );
    };

    const createCardForEvent = (event: PublishedEventWithPublisher): JSX.Element => {
        if (event.eventName === undefined) {
            return (<ListItem key={"e" + event.eventGuid}/>);
        }

        const [expanded, setExpanded] = React.useState(false);

        let publisherName: string = event.displayNameEng ?? "";

        if (event.firstNameHeb !== null) {
            publisherName = event.firstNameHeb + " " + event.lastNameHeb;
        }

        return (
            <ListItem key={"e" + event.eventGuid}>
                <Card sx={{
                    width: `calc(100% - ${Constants.muiBoxDefaultPadding * 2}px)`,
                }}>
                    <CardHeader
                        avatar={
                            <Avatar alt={event.campaignName} src={event.campaignLogoUrl}/>
                        }
                        title={<Link to={`${ScreenRoutes.PublicEventPage}${event.eventGuid}`}>{event.eventName}</Link>}
                        subheader={`Published by ${publisherName} on ${toDdMmYyyy(event.publishingDate)}`}
                        action={
                            <EventIcon/>
                        }
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {event.eventDescription}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <ExpandMore
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
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={collapseTypographySx}>
                        <Typography paragraph>
                            Location: {event.eventLocation} <br/>
                            Start time: {toDdMmYyyyHhMm(event.eventStartTime)} <br/>
                            End time: {toDdMmYyyyHhMm(event.eventEndTime)} <br/>
                            Max attendees: {event.maxAttendees} <br/>
                            Current attendees: {event.numAttending}
                        </Typography>
                    </Collapse>
                </Card>
            </ListItem>
        );
    };

    const renderHomePageList = () => {
        return (
            <List>
                {(props.homePageController.announcementsAndEvents !== null) &&
                    props.homePageController.announcementsAndEvents.map((announcementOrEvent) => {
                        if (instanceOfAnnouncementWithPublisherDetails(announcementOrEvent)) {
                            return (createCardForAnnouncement(announcementOrEvent));
                        } else if (instanceOfPublishedEventWithPublisher(announcementOrEvent)) {
                            return (createCardForEvent(announcementOrEvent));
                        }
                    })}
            </List>);
    };

    return (
        <Paper sx={{
            marginBottom: `${Constants.muiBoxDefaultPadding}px`,
        }}>
            {props.homePageController.announcementsAndEvents !== null ? renderHomePageList() : null}
        </Paper>
    );
}

export default HomePage;
