import React from "react";
import {FormControl, InputLabel, Select, SelectChangeEvent} from "@mui/material";
import "../ProfilePage";
import City from "../../models/city";

interface Props {
    handleCityChange: (event: SelectChangeEvent<HTMLSelectElement>) => void;
    cities: City[];
}

const CityField = ({handleCityChange, cities}: Props) => {
    return (
                <FormControl sx={{width:"60%"}}>
                    <InputLabel id="demo-simple-select-label" variant="outlined">
                        City
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="City"
                        onChange={handleCityChange}
                        native
                    >
                        <option value=""/>
                        {cities.map((city) => {
                            return (
                                <option key={city.cityId} value={city.cityName}>
                                    {city.cityName}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
    );
};

export default CityField;