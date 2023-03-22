import HasPublishingDate from "./has-publishing-date";
import CustomEvent from "./custom-event";

interface PublishedEventWithPublisher extends CustomEvent, HasPublishingDate{
    firstNameHeb: string | null;
    lastNameHeb: string | null;
    displayNameEng: string | null;
    profilePicUrl?: string;
    email?: string;
    phoneNum?: string;
    campaignName?: string;
    campaignLogoUrl?: string;
}

export default PublishedEventWithPublisher;
