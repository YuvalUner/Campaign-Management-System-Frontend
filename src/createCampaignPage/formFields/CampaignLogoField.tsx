import React from "react";
import Campaign from "../../models/campaign";
import {FormControl, TextField} from "@mui/material";

interface CampaignLogoFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignLogoField(props: CampaignLogoFieldProps): JSX.Element {

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignLogoUrl = event.target.value;
    };

    return (
        <FormControl>
            <TextField
                label={"URL to campaign logo"}
                variant={"outlined"}
                onChange={onChange}
            />
        </FormControl>
    );
}

export default CampaignLogoField;
