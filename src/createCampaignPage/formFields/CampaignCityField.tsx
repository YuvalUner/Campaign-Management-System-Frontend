import React, {useEffect} from "react";
import Campaign from "../../models/campaign";
import City from "../../models/city";
import {Alert, FormControl, InputLabel, Select} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ComponentIds from "../../utils/constantsAndStaticObjects/component-ids";
import fieldStyles from "./fields.module.css";
import Events from "../../utils/helperMethods/events";

interface CampaignCityFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    cities: City[];
}

function CampaignCityField(props: CampaignCityFieldProps): JSX.Element {

    const [cityNameErrorState, setCityNameErrorState] = React.useState<boolean>(false);

    const handleChange = (event: SelectChangeEvent<HTMLSelectElement>): void => {
        props.campaign.current.cityName = event.target.value as string;
        if (cityNameErrorState) {
            setCityNameErrorState(false);
        }
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.CampaignCityInvalid, () => {
            setCityNameErrorState(true);
        });
        return () => {
            Events.unsubscribe(Events.EventNames.CampaignCityInvalid, () => {
                setCityNameErrorState(true);
            });
        };
    });

    return (
        <FormControl variant={"outlined"} className={fieldStyles.full_length_field}>
            <InputLabel id={ComponentIds.CitySelectLabel}>City</InputLabel>
            <Select
                labelId={ComponentIds.CitySelectLabel}
                onChange={handleChange}
                label={"City"}
                native
            >
                <option aria-label={"None"} value={""}/>
                {props.cities.map((city) => {
                    return <option key={city.cityId} value={city.cityName}>{city.cityName}</option>;
                })}
            </Select>
            {cityNameErrorState && <Alert severity={"error"}>
                Please select a city
            </Alert>}
        </FormControl>
    );
}

export default CampaignCityField;
