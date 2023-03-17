import React, {useState} from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";
import UserWithCampaigns from "./models/user-with-campaigns";


function App(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserWithCampaigns>({} as UserWithCampaigns);

    return (
        <BrowserRouter>
            <TopMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>
            <Router/>
        </BrowserRouter>
    );
}

export default App;
