import React from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack} from "@mui/material";
import ComponentIds from "../../utils/constantsAndStaticObjects/component-ids";
import Campaign from "../../models/campaign";
import City from "../../models/city";
import CampaignCityField from "./CampaignCityField";

interface IsMunicipalChoiceFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    cities: City[];
}

function IsMunicipalChoiceField(props: IsMunicipalChoiceFieldProps): JSX.Element {

    const [isMunicipal, setIsMunicipal] = React.useState<boolean>(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.isMunicipal = event.target.value === "true";
        setIsMunicipal(event.target.value === "true");
    };

    return (
        <FormControl>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <div>
                    <FormLabel id={ComponentIds.MunicipalChoiceLabel}>Campaign type</FormLabel>
                    <RadioGroup
                        aria-labelledby={ComponentIds.MunicipalChoiceLabel}
                        defaultValue={true}
                        onChange={handleChange}
                    >
                        <FormControlLabel control={<Radio/>} label={"Municipal"} value={true}/>
                        <FormControlLabel control={<Radio/>} label={"National"} value={false}/>
                    </RadioGroup>
                </div>
                {isMunicipal && <CampaignCityField campaign={props.campaign} cities={props.cities}/>}
            </Stack>
        </FormControl>
    );
}

export default IsMunicipalChoiceField;
