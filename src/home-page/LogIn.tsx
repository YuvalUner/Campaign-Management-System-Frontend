import React from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import ExternalAuthDto from "../models/external-auth-dto";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";

function LogIn(): JSX.Element {

    const onSuccess = async (response: CredentialResponse): Promise<void> => {

        const externalAuth : ExternalAuthDto = {
            idToken: response.credential as string,
            provider:  config.OAuthProvider
        };

        const res = await GenericRequestMaker.MakePostRequest(
            (config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignIn) as string,
            externalAuth
        );

        console.log(res);
    };

    const onError = (): void => {
        console.log("Error");
    };


    return (
        <GoogleLogin onSuccess={onSuccess} onError={onError}/>
    );
}

export default LogIn;
