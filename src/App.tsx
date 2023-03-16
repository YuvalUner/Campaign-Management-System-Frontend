import React, {useState} from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";


function App(): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <BrowserRouter>
            <TopMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <Router/>
        </BrowserRouter>
    );
}

export default App;
