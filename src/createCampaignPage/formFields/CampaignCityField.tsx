import React from "react";
import Campaign from "../../models/campaign";
import City from "../../models/city";
import {FormControl, InputLabel, Select} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ComponentIds from "../../utils/constantsAndStaticObjects/component-ids";

interface CampaignCityFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    cities: City[];
}

function CampaignCityField(props: CampaignCityFieldProps): JSX.Element {

    const handleChange = (event: SelectChangeEvent<HTMLSelectElement>): void => {
        props.campaign.current.cityName = event.target.value as string;
    };

    return (
        <FormControl variant={"outlined"}>
            <InputLabel id={ComponentIds.CitySelectLabel}>City</InputLabel>
            <Select
                labelId={ComponentIds.CitySelectLabel}
                onChange={handleChange}
                label={"City"}
                native
                required={true}
            >
                <option aria-label={"None"} value={""}/>
                {props.cities.map((city) => {
                    return <option key={city.cityId} value={city.cityName}>{city.cityName}</option>;
                })}
            </Select>
        </FormControl>
    );
}

export default CampaignCityField;
