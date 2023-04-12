import React, {useEffect} from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import ExternalAuthDto from "../../models/external-auth-dto";
import ServerRequestMaker from "../../utils/server-request-maker";
import config from "../../app-config.json";
import {StatusCodes} from "http-status-codes";
import {useNavigate} from "react-router-dom";
import ScreenRoutes from "../../utils/constantsAndStaticObjects/screen-routes";
import Events from "../../utils/events";


function LogIn(): JSX.Element {

    const navigate = useNavigate();
    const [shouldHideEffect, setShouldHideEffect] = React.useState(false);

    const onSuccess = async (response: CredentialResponse): Promise<void> => {

        const externalAuth: ExternalAuthDto = {
            idToken: response.credential as string,
            provider: config.OAuthProvider,
        };

        const res = await ServerRequestMaker.MakePostRequest(
            (config.ControllerUrls.Tokens.Base + config.ControllerUrls.Tokens.SignIn) as string,
            externalAuth,
        );

        if (res.status === StatusCodes.CREATED || res.status === StatusCodes.OK) {
            Events.dispatch(Events.EventNames.UserLoggedIn);
            if (!shouldHideEffect) {
                Events.dispatch(Events.EventNames.LeftDrawerOpened);
            }

            if (res.status === StatusCodes.CREATED) {
                navigate(ScreenRoutes.ProfilePage);
            }
        }
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.ShouldHideEffects, ((evt: CustomEvent) => {
            setShouldHideEffect(evt.detail as boolean);
        }) as EventListenerOrEventListenerObject);
        return () => {
            Events.unsubscribe(Events.EventNames.ShouldHideEffects, ((evt: CustomEvent) => {
                setShouldHideEffect(evt.detail as boolean);
            }) as EventListenerOrEventListenerObject);
        };
    });


    return (
        <GoogleLogin

            onSuccess={onSuccess}
            theme={"filled_blue"}
        />
    );
}

export default LogIn;
