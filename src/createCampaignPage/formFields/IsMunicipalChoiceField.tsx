import React from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import ComponentIds from "../../utils/constantsAndStaticObjects/component-ids";
import Campaign from "../../models/campaign";

interface IsMunicipalChoiceFieldProps {
    campaign: React.MutableRefObject<Campaign>;
}

function IsMunicipalChoiceField(props: IsMunicipalChoiceFieldProps): JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.isMunicipal = event.target.value === "true";
    };

    return (
        <FormControl>
            <FormLabel id={ComponentIds.MunicipalChoiceLabel}>Campaign type</FormLabel>
            <RadioGroup
                aria-labelledby={ComponentIds.MunicipalChoiceLabel}
                defaultValue={true}
                onChange={handleChange}
            >
                <FormControlLabel control={<Radio/>} label={"Municipal"} value={true}/>
                <FormControlLabel control={<Radio/>} label={"National"} value={false}/>
            </RadioGroup>
        </FormControl>
    );
}

export default IsMunicipalChoiceField;
