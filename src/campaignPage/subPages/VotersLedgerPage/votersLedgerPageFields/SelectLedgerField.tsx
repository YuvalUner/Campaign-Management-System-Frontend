import React, {Dispatch, SetStateAction, useEffect} from "react";
import CustomVotersLedger from "../../../../models/custom-voters-ledger";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import VotersLedgerFilterRecord from "../../../../models/voters-ledger-filter-record";
import CustomVotersLedgerContent from "../../../../models/custom-voters-ledger-content";
import Constants from "../../../../utils/constantsAndStaticObjects/constants";

interface SelectLedgerFieldProps {
    customLedgers: CustomVotersLedger[];
    isCustomCampaign: boolean;
    selectedLedgerGuid: string;
    setSelectedLedgerGuid: (guid: string) => void;
    setSearchResults: Dispatch<SetStateAction<VotersLedgerFilterRecord[] | CustomVotersLedgerContent[]>>;
}

function SelectLedgerField(props: SelectLedgerFieldProps): JSX.Element {

    const onChange = (event: SelectChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            props.setSelectedLedgerGuid(event.target.value as string);
        }
        props.setSearchResults([]);
    };

    useEffect(() => {
        if (props.isCustomCampaign) {
            props.setSelectedLedgerGuid(Constants.OfficialLedgerGuid);
        } else if (props.customLedgers.length > 0) {
            props.setSelectedLedgerGuid(props.customLedgers[0].ledgerGuid ?? "");
        } else {
            props.setSelectedLedgerGuid("");
        }
    }, [props.isCustomCampaign, props.isCustomCampaign]);

    return (
        <FormControl fullWidth={true}>
            <InputLabel id={"select-ledger-label"}>Select ledger</InputLabel>
            <Select
                labelId={"select-ledger-label"}
                onChange={onChange}
                label={"Select ledger"}
                // This is a bit of a hack, but it works. The value of the select is the ledgerGuid of the ledger,
                // and the conversion is done because value must, for whatever reason, be "" | HTMLInputElement |
                // undefined. The ledgerGuid is a string, so it must be converted to unknown, then to undefined.
                value={props.selectedLedgerGuid as unknown as undefined}
            >
                {!props.isCustomCampaign && <MenuItem value={Constants.OfficialLedgerGuid}>Official ledger</MenuItem>}
                {props.isCustomCampaign && props.customLedgers.length === 0
                    && <MenuItem value={""}><em>No ledgers found</em></MenuItem>}
                {props.customLedgers.map((ledger, index) => {
                    return (
                        <MenuItem key={index} value={ledger.ledgerGuid?? ""}>{ledger.ledgerName}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

export default SelectLedgerField;
