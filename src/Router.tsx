import React, {memo} from "react";
import {Routes, Route} from "react-router-dom";
import HomePage from "./homePage/HomePage";
import ScreenRoutes from "./utils/constantsAndStaticObjects/screen-routes";
import ProfilePage from "./profilePage/ProfilePage";
import CampaignPage from "./campaignPage/CampaignPage";
import PublicCampaignPage from "./campaignPage/PublicCampaignPage";
import PublicEventPage from "./event/PublicEventPage";
import HomePageControl from "./models/home-page-control";
import Constants from "./utils/constantsAndStaticObjects/constants";
import PersonalBallotPage from "./personalBallotPage/PersonalBallotPage";
import CreateCampaignPage from "./createCampaignPage/CreateCampaignPage";
import JoinCampaignPage from "./joinCampaignPage/JoinCampaignPage";
import NotFoundPage from "./notFoundPage/NotFoundPage";

/**
 * This is the main router for the application. All routes should be added here.
 * Always define the route path in the ScreenRoutes class to avoid typos.
 */
function Router(): JSX.Element {

    const [homePageControl, setHomePageControl] = React.useState<HomePageControl>({
        announcementsAndEvents: null,
        limit: Constants.defaultLimit,
        offset: Constants.defaultOffset,
        hasMore: true,
    });

    return (
        <Routes key={"MainRouter"}>
            <Route path={ScreenRoutes.HomePage} element={<HomePage
                homePageControl={homePageControl} setHomePageControl={setHomePageControl}/>}/>
            <Route path={ScreenRoutes.ProfilePage} element={<ProfilePage/>}/>
            <Route path={ScreenRoutes.CampaignRoute} element={<CampaignPage/>}/>
            <Route path={ScreenRoutes.PublicCampaignRoute} element={<PublicCampaignPage/>}/>
            <Route path={ScreenRoutes.PublicEventRoute} element={<PublicEventPage/>}/>
            <Route path={ScreenRoutes.PersonalBallotPage} element={<PersonalBallotPage/>} />
            <Route path={ScreenRoutes.CreateCampaignPage} element={<CreateCampaignPage/>} />
            <Route path={ScreenRoutes.AcceptInviteRoute} element={<JoinCampaignPage/>} />
            <Route path={"*"} element={<NotFoundPage/>}/>
        </Routes>
    );
}

export default memo(Router, () => true);
