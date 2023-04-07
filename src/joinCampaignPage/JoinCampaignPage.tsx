import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

function JoinCampaignPage(): JSX.Element {

    const params = useParams();

    useEffect(() => {
        const inviteGuid = params.inviteGuid;
        console.log("Invite Guid: " + inviteGuid);
    });

    return (
        <div>
            <h1>Join Campaign Page</h1>
        </div>
    );
}

export default JoinCampaignPage;
