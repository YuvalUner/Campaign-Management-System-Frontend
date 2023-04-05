import React, {useEffect} from "react";
import HomePageControl from "../models/home-page-control";
import ServerRequestMaker from "../utils/server-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import AnnouncementWithPublisherDetails from "../models/announcement-with-publisher-details";
import PublishedEventWithPublisher from "../models/published-event-with-publisher";
import Events from "../utils/events";
import {
    List,
    Paper,
} from "@mui/material";

import Constants from "../utils/constantsAndStaticObjects/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import componentIds from "../utils/constantsAndStaticObjects/component-ids";
import AnnouncementCard from "./cards/AnnouncementCard";
import EventCard from "./cards/EventCard";
import ComponentIds from "../utils/constantsAndStaticObjects/component-ids";

const instanceOfAnnouncementWithPublisherDetails =
    (object: AnnouncementWithPublisherDetails | PublishedEventWithPublisher):
        object is AnnouncementWithPublisherDetails => {
        return "announcementGuid" in object;
    };

const instanceOfPublishedEventWithPublisher =
    (object: AnnouncementWithPublisherDetails | PublishedEventWithPublisher):
        object is PublishedEventWithPublisher => {
        return "eventGuid" in object;
    };

const toDict = (arr: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[]) => {
    const dict: { [key: string]: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[] } = {};
    arr.forEach((item) => {
        let key = "";
        if (instanceOfAnnouncementWithPublisherDetails(item)) {
            key = item.announcementGuid as string;
        } else if (instanceOfPublishedEventWithPublisher(item)) {
            key = item.eventGuid as string;
        }
        if (!dict[key]) {
            dict[key] = [];
        }
        dict[key].push(item);
    });
    return dict;
};

interface HomePageProps {
    homePageControl: HomePageControl;
    setHomePageControl: (homePageControl: HomePageControl) => void;
}

function HomePage(props: HomePageProps): JSX.Element {

    const [loading, setLoading] = React.useState(false);

    const retrieveHomePage = async ():
        Promise<void> => {
        if (!loading && props.homePageControl.hasMore) {
            setLoading(true);
            const query = `?limit=${props.homePageControl.limit}&offset=${props.homePageControl.offset}`;
            const res = await ServerRequestMaker.MakeGetRequest<HomePageControl>(
                config.ControllerUrls.PublicBoard.Base + config.ControllerUrls.PublicBoard.GetPublicBoard + query,
            );
            if (res.status === HttpStatusCode.Ok) {
                const announcements: AnnouncementWithPublisherDetails[] | null = res.data.announcements;
                const events: PublishedEventWithPublisher[] | null = res.data.events;
                let hasMore = true;

                let combined: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[] = [];

                if (announcements !== null && events !== null && announcements.length > 0 && events.length > 0) {
                    combined = combined.concat(announcements);
                    combined = combined.concat(events);

                    // Convert to dictionary
                    const combinedDict = toDict(combined);
                    combined = [];
                    const dictKeys = Object.keys(combinedDict);
                    // Sort each array by publishing date, in order to maintain the order established by the server
                    // when the data was retrieved, as the server takes user preferences into account
                    dictKeys.forEach((key) => {
                        combinedDict[key].sort((a, b) => {
                            return a.publishingDate.valueOf() - b.publishingDate.valueOf();
                        });
                        combinedDict[key].forEach((item) => {
                            combined.push(item);
                        });
                    });
                } else if (announcements !== null && announcements.length > 0) {
                    combined = announcements;
                } else if (events !== null && events.length > 0) {
                    combined = events;
                } else {
                    hasMore = false;
                }

                props.setHomePageControl({
                    announcementsAndEvents: props.homePageControl.announcementsAndEvents === null ?
                        combined :
                        props.homePageControl.announcementsAndEvents.concat(combined),
                    limit: props.homePageControl.limit,
                    offset: props.homePageControl.offset + props.homePageControl.limit,
                    hasMore: hasMore,
                });
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        retrieveHomePage();
    }, []);

    const emptyAndRetrieveHomePage = async (): Promise<void> => {
        props.setHomePageControl({
            announcementsAndEvents: null,
            limit: props.homePageControl.limit,
            offset: Constants.defaultOffset,
            hasMore: true,
        });
        await retrieveHomePage();
    };

    useEffect(() => {
        // When the user logs in or out, we want to empty out the home page and then retrieve it again, so that
        // the user can see the announcements and events that are relevant to them.
        Events.subscribe(Events.EventNames.UserLoggedIn, emptyAndRetrieveHomePage);
        Events.subscribe(Events.EventNames.UserLoggedOut, emptyAndRetrieveHomePage);
        // Clean up the event listeners when the component unmounts.
        return () => {
            Events.unsubscribe(Events.EventNames.UserLoggedIn, emptyAndRetrieveHomePage);
            Events.unsubscribe(Events.EventNames.UserLoggedOut, emptyAndRetrieveHomePage);
        };
    }, []);

    const renderHomePageList = () => {
        return (
            <List>
                {props.homePageControl.announcementsAndEvents !== null ?
                    props.homePageControl.announcementsAndEvents.map((announcementOrEvent) => {
                        if (instanceOfAnnouncementWithPublisherDetails(announcementOrEvent)) {
                            return (<AnnouncementCard announcement={announcementOrEvent}
                                key={"a" + announcementOrEvent.announcementGuid}/>);
                        } else if (instanceOfPublishedEventWithPublisher(announcementOrEvent)) {
                            return (<EventCard event={announcementOrEvent}
                                key={"e" + announcementOrEvent.eventGuid}/>);
                        }
                    }) : <></>}
            </List>);
    };

    return (
        <InfiniteScroll next={retrieveHomePage}
            hasMore={props.homePageControl.hasMore}
            loader={<></>}
            dataLength={props.homePageControl.announcementsAndEvents?.length ?? 0}
            scrollableTarget={componentIds.DrawerPageFlowMainBoxId}
            style={{height: "100%", width: "100%", overflow: "hidden"}}
        >
            <Paper sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }} id={ComponentIds.HomePagePaper}>
                {props.homePageControl.announcementsAndEvents !== null ? renderHomePageList() : null}
            </Paper>
        </InfiniteScroll>
    );
}

export default HomePage;
