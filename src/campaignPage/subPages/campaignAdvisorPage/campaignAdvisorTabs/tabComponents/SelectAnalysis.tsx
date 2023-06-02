import React from "react";
import AnalysisOverview from "../../../../../models/analysis-overview";
import fieldStyles from "../../../../../createCampaignPage/formFields/fields.module.css";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import ComponentIds from "../../../../../utils/constantsAndStaticObjects/component-ids";
import {toDdMmYyyy} from "../../../../../utils/helperMethods/date-converter";

interface SelectAnalysisProps {
    previousAnalyses: AnalysisOverview[];
    selectedOption: string;
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    fetchSelected: (selectedOption: string) => void;
}

function SelectAnalysis(props: SelectAnalysisProps): JSX.Element {

    const formatName = (overview: AnalysisOverview): string => {
        if (overview.resultsTitle !== null && overview.resultsTitle !== "" && overview.resultsTitle !== undefined) {
            return overview.resultsTitle;
        }
        return `${overview.analysisTarget} - ${toDdMmYyyy(overview.timePerformed as Date)}`;
    };

    return (
        <FormControl variant={"outlined"} className={fieldStyles.full_length_field}>
            <InputLabel>Select result</InputLabel>
            <Select
                labelId={ComponentIds.CitySelectLabel}
                onChange={(event) => {
                    if (event.target.value !== null && event.target.value !== undefined && event.target.value !== "") {
                        props.fetchSelected(event.target.value as string);
                        props.setSelectedOption(event.target.value as string);
                    }
                }}
                label={"Select result"}
                value={props.selectedOption}
            >
                {props.previousAnalyses.map((result) => {
                    return <MenuItem key={result.resultsGuid as string}
                        value={result.resultsGuid as string}>
                        {formatName(result)}
                    </MenuItem>;
                })}
            </Select>
        </FormControl>
    );
}

export default SelectAnalysis;
