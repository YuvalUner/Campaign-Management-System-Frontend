import React, {useEffect} from "react";
import HomePageControl from "../models/home-page-control";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import AnnouncementWithPublisherDetails from "../models/announcement-with-publisher-details";
import PublishedEventWithPublisher from "../models/published-event-with-publisher";
import Events from "../utils/events";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper} from "@mui/material";
import Constants from "../utils/constants";

interface HomePageProps {
    homePageController: HomePageControl;
    setHomePageController: (homePageController: HomePageControl) => void;
}

function HomePage(props: HomePageProps): JSX.Element {

    const retrieveHomePage = async (): Promise<void> => {
        const query = `?limit=${props.homePageController.limit}&offset=${props.homePageController.offset}`;
        const res = await GenericRequestMaker.MakeGetRequest<HomePageControl>(
            config.ControllerUrls.PublicBoard.Base + config.ControllerUrls.PublicBoard.GetPublicBoard + query,
        );
        if (res.status === HttpStatusCode.Ok) {
            const announcements: AnnouncementWithPublisherDetails[] | null = res.data.announcements;
            const events: PublishedEventWithPublisher[] | null = res.data.events;

            let combined: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[] = [];

            if (announcements !== null && events !== null) {
                combined = announcements.concat(events);
                combined.sort((a, b) => {
                    return a.publishingDate.valueOf() - b.publishingDate.valueOf();
                });
            } else if (announcements !== null) {
                combined = announcements;
            } else if (events !== null) {
                combined = events;
            }

            props.setHomePageController({
                ...props.homePageController,
                announcementsAndEvents: combined,
            });
        }
    };

    const emptyOutAndRetrieveHomePage = async (): Promise<void> => {
        props.setHomePageController({
            limit: props.homePageController.limit,
            offset: 0,
            announcementsAndEvents: null,
        });
        await retrieveHomePage();
    };

    useEffect(() => {
        if (props.homePageController.announcementsAndEvents === null) {
            // eslint-disable-next-line no-console
            retrieveHomePage().catch(console.error);
        }
    }, []);

    useEffect(() => {
        Events.subscribe(Events.EventNames.UserLoggedIn, emptyOutAndRetrieveHomePage);
        return () => {
            Events.unsubscribe(Events.EventNames.UserLoggedIn, emptyOutAndRetrieveHomePage);
        };
    }, []);

    const instanceOfAnnouncementWithPublisherDetails = (object: any): object is AnnouncementWithPublisherDetails => {
        return "announcementGuid" in object;
    };

    const instanceOfPublishedEventWithPublisher = (object: any): object is PublishedEventWithPublisher => {
        return "eventGuid" in object;
    };

    const renderHomePageList = () => {
        return <List>
            {(props.homePageController.announcementsAndEvents !== null) &&
                props.homePageController.announcementsAndEvents.map((announcementOrEvent) => {
                    if (instanceOfAnnouncementWithPublisherDetails(announcementOrEvent)) {
                        return (
                            <ListItem key={"a" + announcementOrEvent.announcementGuid}>
                                <ListItemAvatar>
                                    <Avatar alt={announcementOrEvent.campaignName}
                                        src={announcementOrEvent.campaignLogoUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={announcementOrEvent.announcementTitle}/>
                            </ListItem>
                        );
                    } else if (instanceOfPublishedEventWithPublisher(announcementOrEvent)) {
                        return (
                            <ListItem key={"e" + announcementOrEvent.eventGuid}>
                                <ListItemAvatar>
                                    <Avatar alt={announcementOrEvent.campaignName}
                                        src={announcementOrEvent.campaignLogoUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={announcementOrEvent.eventName}/>
                            </ListItem>
                        );
                    }
                })}
        </List>;
    };

    return (
        <Paper sx={{
            marginBottom: `${Constants.muiBoxDefaultPadding}px`,
            overflow: "auto",
        }}>
            {props.homePageController.announcementsAndEvents !== null ? renderHomePageList() : null}
        </Paper>
    );
}

export default HomePage;
