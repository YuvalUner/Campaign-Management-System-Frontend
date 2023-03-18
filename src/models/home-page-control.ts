import AnnouncementWithPublisherDetails from "./announcement-with-publisher-details";
import PublishedEventWithPublisher from "./published-event-with-publisher";

interface HomePageControl{
    limit?: number;
    offset?: number;
    announcementsAndEvents?: (AnnouncementWithPublisherDetails | PublishedEventWithPublisher)[] | null;
}

export default HomePageControl;
