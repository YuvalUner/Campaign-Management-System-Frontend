import React from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import ExternalAuthDto from "../models/external-auth-dto";
import GenericRequestMaker from "../utils/generic-request-maker";
import config from "../app-config.json";
import {StatusCodes} from "http-status-codes";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../utils/screen-routes";
import Events from "../utils/events";


function LogIn(): JSX.Element {

    const navigate = useNavigate();

    const onSuccess = async (response: CredentialResponse): Promise<void> => {

        const externalAuth: ExternalAuthDto = {
            idToken: response.credential as string,
            provider: config.OAuthProvider,
        };

        const res = await GenericRequestMaker.MakePostRequest(
            (config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignIn) as string,
            externalAuth,
        );

        if (res.status === StatusCodes.CREATED || res.status === StatusCodes.OK) {
            Events.dispatch(Events.EventNames.UserLoggedIn);

            if (res.status === StatusCodes.CREATED) {
                navigate(ScreenRoutes.ProfilePage);
            }
        }
    };


    return (
        <GoogleLogin
            onSuccess={onSuccess}
            theme={"filled_blue"}
        />
    );
}

export default LogIn;
