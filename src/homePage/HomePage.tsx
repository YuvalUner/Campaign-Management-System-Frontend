import React, {useEffect} from "react";
import HomePageControl from "../models/home-page-control";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {HttpStatusCode} from "axios";
import AnnouncementWithPublisherDetails from "../models/announcement-with-publisher-details";
import PublishedEventWithPublisher from "../models/published-event-with-publisher";
import Events from "../utils/events";

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
                    return a.publishingDate.getTime() - b.publishingDate.getTime();
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
            ...props.homePageController,
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

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}

export default HomePage;
