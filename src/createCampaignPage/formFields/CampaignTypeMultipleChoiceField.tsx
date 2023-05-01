import React from "react";
import {Alert, Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Tooltip} from "@mui/material";
import ComponentIds from "../../utils/constantsAndStaticObjects/component-ids";
import Campaign from "../../models/campaign";
import City from "../../models/city";
import CampaignCityField from "./CampaignCityField";
import {Link} from "react-router-dom";
import ScreenRoutes from "../../utils/constantsAndStaticObjects/screen-routes";
import InfoIcon from "@mui/icons-material/Info";

interface IsMunicipalChoiceFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    cities: City[];
    authStatus: boolean;
}

function CampaignTypeMultipleChoiceField(props: IsMunicipalChoiceFieldProps): JSX.Element {

    const [campaignType, setCampaignType] = React.useState<string>("true");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.campaign.current.isMunicipal = event.target.value === "true";
        props.campaign.current.isCustomCampaign = event.target.value === "custom";
        setCampaignType(event.target.value);
    };

    return (
        <FormControl>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Box>
                    <Stack sx={{
                        width: "200px"
                    }} direction={"row"}>
                        <FormLabel id={ComponentIds.MunicipalChoiceLabel}>Campaign type</FormLabel>
                        <Tooltip title=
                            {"Municipal campaigns are for a specific city, while national " +
                                         "campaigns are for the entire country, and custom campaigns are for whatever" +
                                         "scope you need.\n \n" +
                                         "Only verified users can create and enter municipal and national campaigns," +
                                         "while custom campaigns are open to everyone."}>
                            <InfoIcon sx={{fontSize: 16, marginLeft: 1}} color={"primary"}/>
                        </Tooltip>
                    </Stack>
                    <RadioGroup
                        aria-labelledby={ComponentIds.MunicipalChoiceLabel}
                        defaultValue={true}
                        onChange={handleChange}
                    >
                        <FormControlLabel control={<Radio/>} label={"Municipal"} value={"true"}/>
                        <FormControlLabel control={<Radio/>} label={"National"} value={"false"}/>
                        <FormControlLabel control={<Radio/>} label={"Custom"} value={"custom"}/>
                    </RadioGroup>
                    {!props.authStatus && campaignType !== "custom" && <Alert severity={"error"}>
                        You must be verified to create a municipal or national campaign.<br/>
                        Please verify <Link to={ScreenRoutes.ProfilePage}>here</Link>.
                    </Alert>}
                </Box>
                {campaignType === "true" && <CampaignCityField campaign={props.campaign} cities={props.cities}/>}
            </Stack>
        </FormControl>
    );
}

export default CampaignTypeMultipleChoiceField;
