import Announcement from "./announcement";
import HasPublishingDate from "./has-publishing-date";

interface AnnouncementWithPublisherDetails extends Announcement, HasPublishingDate{
    firstNameHeb?: string;
    lastNameHeb?: string;
    displayNameEng?: string;
    profilePicUrl?: string;
    email?: string;
    phoneNum?: string;
    campaignName?: string;
    campaignLogoUrl?: string;
}

export default AnnouncementWithPublisherDetails;
