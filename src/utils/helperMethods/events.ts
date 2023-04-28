/**
 * A util for handling custom events.<br>
 * Stores the names of all events in one place, and provides methods for subscribing, unsubscribing,
 * and dispatching events.
 */
class Events{

    // Add the names of any future events here
    public static readonly EventNames = {
        UserLoggedIn: "UserLoggedIn",
        UserLoggedOut: "UserLoggedOut",
        LeftDrawerOpened: "LeftDrawerOpened",
        LeftDrawerClosed: "LeftDrawerClosed",
        PageBottomReached: "PageBottomReached",
        ShouldScrollToRecordedPosition: "ShouldScrollToRecordedPosition",
        ShouldResetScrollPosition: "ShouldResetScrollPosition",
        NewCampaignSubmitted: "NewCampaignSubmitted",
        CampaignNameInvalid: "CampaignNameInvalid",
        CampaignCityInvalid: "CampaignCityInvalid",
        RefreshCampaignsList: "RefreshCampaignsList",
        ShouldHideEffects: "ShouldHideEffects",
        RefreshCustomLedgers: "RefreshCustomLedgers",
        BubbleErrorUpwards: "BubbleErrorUpwards",
        ShouldRaisePrompt: "ShouldRaisePrompt",
        ShouldStopRaisingPrompt: "ShouldStopRaisingPrompt",
        RaisePrompt: "RaisePrompt",
        GoForward: "GoForward",
    };

    /**
     * Subscribe to an event.
     * @param event The name of the event to subscribe to. use Events.EventNames to get the name of an event.
     * @param callback The function to call when the event is dispatched.
     */
    public static subscribe(event: string, callback: EventListenerOrEventListenerObject): void{
        document.addEventListener(event, callback);
    }

    /**
     * Unsubscribe from an event.
     * @param event The name of the event to subscribe to. use Events.EventNames to get the name of an event.
     * @param callback The function to call when the event is dispatched.
     */
    public static unsubscribe(event: string, callback: EventListenerOrEventListenerObject): void{
        // Unsubscribe from an event
        document.removeEventListener(event, callback);
    }

    /**
     * Dispatch an event with optional data.
     * @param event The name of the event to dispatch. use Events.EventNames to get the name of an event.
     * @param data Any additional data to pass to the event.
     */
    public static dispatch(event: string, data: unknown = null): void{
        // Dispatch an event
        document.dispatchEvent(new CustomEvent(event, {detail: data}));
    }
}

export default Events;
