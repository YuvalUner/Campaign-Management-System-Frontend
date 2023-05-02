import React, {useEffect} from "react";
import Campaign from "../../models/campaign";
import {Alert, FormControl, TextField} from "@mui/material";
import fieldStyles from "./fields.module.css";
import Events from "../../utils/events";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";
import Events from "../../utils/helperMethods/events";

interface CampaignNameFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    defaultValue?: string;
    disabled?: boolean;
    InputProps?:Partial<StandardInputProps>;

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
                defaultValue={props.defaultValue}
                disabled={props.disabled}
                InputProps={props.InputProps}
            />
            {campaignNameErrorState && <Alert severity={"error"} className={fieldStyles.error_message}>
                Campaign name is required
            </Alert>}
        </FormControl>
    );
}

export default CampaignNameField;