interface CustomEvent{
    eventGuid?: string;
    eventName?: string;
    eventDescription?: string;
    eventLocation?: string;
    eventStartTime?: Date;
    eventEndTime?: Date;
    maxAttendees?: number;
    numAttending?: number;
    campaignGuid?: string;
    isOpenJoin?: boolean;

}

export default CustomEvent;
