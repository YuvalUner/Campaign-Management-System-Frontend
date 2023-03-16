import React from "react";
import {Routes, Route} from "react-router-dom";
import HomePage from "./homePage/HomePage";
import ScreenRoutes from "./utils/screen-routes";
import ProfilePage from "./ProfilePage/ProfilePage";

/**
 * This is the main router for the application. All routes should be added here.
 * Always define the route path in the ScreenRoutes class to avoid typos.
 */
function Router(): JSX.Element {
    return (
        <Routes>
            <Route path={ScreenRoutes.HomePage} element={<HomePage/>}/>
            <Route path={ScreenRoutes.ProfilePage} element={<ProfilePage/>}/>
        </Routes>
    );
}

export default Router;
