import React from "react";
import {TextField} from "@mui/material";
import Campaign from "../../models/campaign";

interface CampaignDescriptionFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignDescriptionField(props: CampaignDescriptionFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignDescription = event.target.value;
    };

    return (
        <div>
            <TextField
                label={"Campaign Description"}
                variant={"outlined"}
                onChange={handleChange}
            />
        </div>
    );
}

export default CampaignDescriptionField;
