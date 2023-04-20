
/**
 * This file contains the names of all the screens in the app and the route associated with them.<br/>
 * It is used to avoid typos and to make the code more readable.<br/>
 * For any new screen, add its name here.<br/>
 * Naming: *Route is the route associated with the screen if the screen requires additional parameters in its route.
 * *Page is the name of the screen, and is also the route if the screen does not require additional parameters in
 * its route.
 */
const ScreenRoutes = {
    HomePage: "/",
    ProfilePage: "/profile",
    CampaignRoute: "/campaign/:campaignGuid/*",
    CampaignPage: "/campaign/",
    PublicCampaignPage: "/public-campaign/",
    PublicCampaignRoute: "/public-campaign/*",
    PublicEventPage: "/public-event/",
    PublicEventRoute: "/public-event/*",
    PersonalBallotPage: "/personal-ballot",
    CreateCampaignPage: "/create-campaign",
    AcceptInvitePage: "/accept-invite/",
    AcceptInviteRoute: "/accept-invite/:inviteGuid",
};

export default ScreenRoutes;
