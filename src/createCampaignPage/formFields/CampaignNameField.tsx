import React from "react";
import Campaign from "../../models/campaign";
import {FormControl, TextField} from "@mui/material";
import fieldStyles from "./fields.module.css";

interface CampaignNameFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignNameField(props: CampaignNameFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignName = event.target.value;
    };

    return (
        <FormControl className={fieldStyles.full_length_field}>
            <TextField
                label={"Campaign Name"}
                variant={"outlined"}
                required={true}
                onChange={handleChange}
            />
        </FormControl>
    );
}

export default CampaignNameField;
