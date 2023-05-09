import React from "react";
import {FormControl, InputLabel, Select, SelectChangeEvent} from "@mui/material";
import "../ProfilePage";

interface Props {
    handleCityChange: (event: SelectChangeEvent<HTMLSelectElement>) => void;
  cities: {
    cityId: number;
    cityName: string;
  }[];
}

const CityField = ({handleCityChange, cities}: Props) => {
    return (
        <label>
            <p>
                <FormControl>
                    <InputLabel id="demo-simple-select-label" variant="outlined">
                        City
                    </InputLabel>
                    <Select
                        className="input-field"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="City"
                        onChange={handleCityChange}
                        native
                    >
                        <option value="" />
                        {cities.map((city) => {
                            return (
                                <option key={city.cityId} value={city.cityName}>
                                    {city.cityName}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
            </p>
        </label>
    );
};

export default CityField;
