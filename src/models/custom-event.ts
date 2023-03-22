interface CustomEvent{
    eventGuid: string | null;
    eventName: string | null;
    eventDescription: string | null;
    eventLocation: string | null;
    eventStartTime?: Date;
    eventEndTime?: Date;
    maxAttendees?: number;
    numAttending?: number;
    campaignGuid?: string;
    isOpenJoin?: boolean;

}

export default CustomEvent;
