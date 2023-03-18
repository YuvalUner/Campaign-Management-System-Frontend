import React from "react";
import {Routes, Route} from "react-router-dom";
import HomePage from "./homePage/HomePage";
import ScreenRoutes from "./utils/screen-routes";
import ProfilePage from "./ProfilePage/ProfilePage";
import HomePageControl from "./models/home-page-control";
import CampaignPage from "./campaignPage/CampaignPage";

interface RouterProps {
    homePageController: HomePageControl;
    setHomePageController: (homePageController: HomePageControl) => void;
}

/**
 * This is the main router for the application. All routes should be added here.
 * Always define the route path in the ScreenRoutes class to avoid typos.
 */
function Router(props: RouterProps): JSX.Element {
    return (
        <Routes>
            <Route path={ScreenRoutes.HomePage} element={<HomePage homePageController={props.homePageController}
                setHomePageController={props.setHomePageController}/>}/>
            <Route path={ScreenRoutes.ProfilePage} element={<ProfilePage/>}/>
            <Route path={ScreenRoutes.CampaignRoute} element={<CampaignPage/>}/>
        </Routes>
    );
}

export default Router;
