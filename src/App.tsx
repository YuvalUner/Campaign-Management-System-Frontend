import React from "react";
import {BrowserRouter} from "react-router-dom";
import TopMenu from "./topMenu/TopMenu";
import Router from "./Router";


function App(): JSX.Element {
    return (
        <BrowserRouter>
            <TopMenu/>
            <Router/>
        </BrowserRouter>
    );
}

export default App;
