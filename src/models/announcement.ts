import HasPublishingDate from "./has-publishing-date";

interface Announcement extends HasPublishingDate{
    announcementContent: string | null;
    announcementTitle: string | null;
    announcementGuid: string | null;
}

export default Announcement;
