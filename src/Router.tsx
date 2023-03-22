import React, {memo} from "react";
import {Routes, Route} from "react-router-dom";
import HomePage from "./homePage/HomePage";
import ScreenRoutes from "./utils/screen-routes";
import ProfilePage from "./ProfilePage/ProfilePage";
import CampaignPage from "./campaignPage/CampaignPage";
import PublicCampaignPage from "./campaignPage/PublicCampaignPage";
import PublicEventPage from "./event/PublicEventPage";


/**
 * This is the main router for the application. All routes should be added here.
 * Always define the route path in the ScreenRoutes class to avoid typos.
 */
function Router(): JSX.Element {

    return (
        <Routes key={"MainRouter"}>
            <Route path={ScreenRoutes.HomePage} element={<HomePage/>}/>
            <Route path={ScreenRoutes.ProfilePage} element={<ProfilePage/>}/>
            <Route path={ScreenRoutes.CampaignRoute} element={<CampaignPage/>}/>
            <Route path={ScreenRoutes.PublicCampaignRoute} element={<PublicCampaignPage/>}/>
            <Route path={ScreenRoutes.PublicEventRoute} element={<PublicEventPage/>}/>
        </Routes>
    );
}

export default memo(Router, () => true);
