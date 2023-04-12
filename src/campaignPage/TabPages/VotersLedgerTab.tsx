import React, {useRef, useState} from "react";
import CloseTabButton from "../utils/CloseTabButton";
import TabPageBasePropsWithPermission from "../utils/tab-page-base-props-with-permission";
import VotersLedgerFilter from "../../models/voters-ledger-filter";
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import IdNumberField from "./votersLedgerTabFields/IdNumberField";
import FieldKeys from "./votersLedgerTabFields/utils/field-keys";
import FirstNameField from "./votersLedgerTabFields/FirstNameField";
import LastNameField from "./votersLedgerTabFields/LastNameField";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import StreetNameField from "./votersLedgerTabFields/StreetNameField";
import BallotNumberField from "./votersLedgerTabFields/BallotNumberField";
import SupportStatusField from "./votersLedgerTabFields/SupportStatusField";
import SearchIcon from "@mui/icons-material/Search";
import VotersLedgerFilterRecord from "../../models/voters-ledger-filter-record";

function VotersLedgerTab(props: TabPageBasePropsWithPermission): JSX.Element {

    const filterParams = useRef<VotersLedgerFilter>({} as VotersLedgerFilter);
    const [searchResults, setSearchResults] = useState<VotersLedgerFilterRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstSearchDone, setFirstSearchDone] = useState<boolean>(false);

    const fields = [
        <IdNumberField key={FieldKeys.IdField} filterParams={filterParams}/>,
        <FirstNameField key={FieldKeys.FirstNameField} filterParams={filterParams}/>,
        <LastNameField key={FieldKeys.LastNameField} filterParams={filterParams}/>,
        <StreetNameField filterParams={filterParams} key={FieldKeys.StreetNameField}/>,
        <BallotNumberField filterParams={filterParams} key={FieldKeys.BallotNumberField}/>,
        <SupportStatusField filterParams={filterParams} key={FieldKeys.SupportStatusField}/>,
    ];

    const renderFields = () => {
        return (
            <>
                {fields.map((field, index) => {
                    return (
                        <Grid2 xs={12} md={4} key={index}>
                            {field}
                        </Grid2>
                    );
                })}
            </>
        );
    };

    const handleSearch = () => {
        setLoading(true);
        setFirstSearchDone(true);
    };

    const renderSearchResults = () => {
        return (
            <>
            </>
        );
    };

    return (
        <>
            <CloseTabButton tabName={props.name} closeFunction={props.closeFunction}/>
            <Stack direction={"column"} spacing={2} sx={{padding: 2, width: "100%"}}>
                <Typography variant={"h5"}>Search</Typography>
                <Grid2 container sx={{
                    marginRight: `${Constants.rightDrawerWidth}px`,
                    border: "1px solid blue",
                    borderRadius: "5px",
                }} spacing={2}>
                    {renderFields()}
                    <Grid2 xs={12} display={"flex"} justifyContent={"end"}>
                        <Button variant={"contained"} endIcon={<SearchIcon/>} onClick={handleSearch} disabled={loading}>
                            Search
                        </Button>
                    </Grid2>
                </Grid2>
                {loading && firstSearchDone && <Stack sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }} direction={"column"} spacing={3}>
                    <Typography variant={"h5"}>Loading search results...</Typography>
                    <CircularProgress/>
                </Stack>}
            </Stack>
        </>
    );
}

export default VotersLedgerTab;
