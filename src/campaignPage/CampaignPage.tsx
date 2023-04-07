import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

function CampaignPage(): JSX.Element {

    const params = useParams();

    useEffect(() => {
        const campaignGuid = params.campaignGuid;
        console.log("Campaign Guid: " + campaignGuid);
    });

    return (
        <div>
            <h1>Campaign Page</h1>
        </div>
    );
}

export default CampaignPage;
