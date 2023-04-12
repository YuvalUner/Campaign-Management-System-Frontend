import React, {useEffect} from "react";
import Campaign from "../../models/campaign";
import {Alert, FormControl, TextField} from "@mui/material";
import fieldStyles from "./fields.module.css";
import Events from "../../utils/events";

interface CampaignNameFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function CampaignNameField(props: CampaignNameFieldProps): JSX.Element {

    const [campaignNameErrorState, setCampaignNameErrorState] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.campaignName = event.target.value;
        if (campaignNameErrorState) {
            setCampaignNameErrorState(false);
        }
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.CampaignNameInvalid, () => {
            setCampaignNameErrorState(true);
        });
        return () => {
            Events.unsubscribe(Events.EventNames.CampaignNameInvalid, () => {
                setCampaignNameErrorState(true);
            });
        };
    }, []);

    return (
        <FormControl className={fieldStyles.full_length_field}>
            <TextField
                label={"Campaign Name"}
                variant={"outlined"}
                onChange={handleChange}
                error={campaignNameErrorState}
            />
            {campaignNameErrorState && <Alert severity={"error"} className={fieldStyles.error_message}>
                Campaign name is required
            </Alert>}
        </FormControl>
    );
}

export default CampaignNameField;
