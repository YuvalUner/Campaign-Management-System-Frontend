import React from "react";
import Campaign from "../../models/campaign";
import {TextField} from "@mui/material";

interface CampaignNameFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignNameField(props: CampaignNameFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignName = event.target.value;
    };

    return (
        <div>
            <TextField
                label={"Campaign Name"}
                variant={"outlined"}
                required={true}
                onChange={handleChange}
            />
        </div>
    );
}

export default CampaignNameField;
