import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {GoogleOAuthProvider} from "@react-oauth/google";
import App from "./App";
import {registerLicense} from "@syncfusion/ej2-base";
import config from "./app-config.json";
import {DevSupport} from "@react-buddy/ide-toolbox";

registerLicense(config.SyncfusionLicenseKey);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

const clientId: string | undefined = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (clientId === undefined) {
    throw new Error("REACT_APP_GOOGLE_CLIENT_ID is not defined");
}

root.render(
    <GoogleOAuthProvider clientId={clientId}>
            <App/>
    </GoogleOAuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
