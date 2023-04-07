import React from "react";
import {FormControl, TextField} from "@mui/material";
import Campaign from "../../models/campaign";
import fieldStyles from "./fields.module.css";

interface CampaignDescriptionFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignDescriptionField(props: CampaignDescriptionFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignDescription = event.target.value;
    };

    return (
        <FormControl className={fieldStyles.full_length_field}>
            <TextField
                label={"Campaign Description"}
                variant={"outlined"}
                onChange={handleChange}
            />
        </FormControl>
    );
}

export default CampaignDescriptionField;
