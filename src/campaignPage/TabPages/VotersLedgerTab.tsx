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
import ServerRequestMaker from "../../utils/server-request-maker";
import config from "../../app-config.json";
import {
    ColumnDirective,
    ColumnsDirective, Edit, ExcelExport,
    Grid,
    GridComponent,
    Page, PdfExport,
    Resize,
    Sort, Toolbar,
} from "@syncfusion/ej2-react-grids";
import {useParams} from "react-router-dom";
import {Inject} from "@syncfusion/ej2-react-schedule";
import {ClickEventArgs} from "@syncfusion/ej2-react-navigations";

function VotersLedgerTab(props: TabPageBasePropsWithPermission): JSX.Element {

    let grid: Grid | null;

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const filterParams = useRef<VotersLedgerFilter>({} as VotersLedgerFilter);
    const [searchResults, setSearchResults] = useState<VotersLedgerFilterRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstSearchDone, setFirstSearchDone] = useState<boolean>(false);
    const [errorLoadingData, setErrorLoadingData] = useState<boolean>(false);

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

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setFirstSearchDone(true);
        setErrorLoadingData(false);
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.VotersLedger.Base + config.ControllerUrls.VotersLedger.Filter + campaignGuid,
            filterParams.current,
        ).then((res) => {
            setSearchResults(res.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setErrorLoadingData(true);
        });
    };


    const toolbarOptions = ["Edit", "ExcelExport", "PdfExport"];
    const editOptions = { allowEditing: true, allowAdding: false, allowDeleting: false };
    // eslint-disable-next-line @typescript-eslint/ban-types
    const editNames: { [key: string] : string } [] = [
        { supportStatus: "Supporting", destId: "true"},
        { supportStatus: "Opposing", destId: "false"},
        { supportStatus: "Unknown", destId: "null"},
    ];

    const toolbarClick = (args: ClickEventArgs) => {
        if (grid && args.item.id === "grid_excelexport") {
            grid.excelExport();
        }
        if (grid && args.item.id === "grid_pdfexport") {
            grid.pdfExport();
        }
    };


    return (
        <>
            <CloseTabButton tabName={props.name} closeFunction={props.closeFunction}/>
            <Stack direction={"column"} spacing={2} sx={{padding: 2, width: "100%"}}>
                <Typography variant={"h5"}>Search</Typography>
                <Grid2 container component={"form"} sx={{
                    marginRight: `${Constants.rightDrawerWidth}px`,
                    border: "1px solid blue",
                    borderRadius: "5px",
                }} spacing={2} onSubmit={handleSearch}>
                    {renderFields()}
                    <Grid2 xs={12} display={"flex"} justifyContent={"end"}>
                        <Button variant={"contained"}
                            type={"submit"} endIcon={<SearchIcon/>} disabled={loading}>
                            Search
                        </Button>
                    </Grid2>
                </Grid2>
                <GridComponent
                    dataSource={searchResults}
                    allowPaging={true}
                    allowSorting={true}
                    allowResizing={true}
                    toolbar={toolbarOptions}
                    editSettings={editOptions}
                    ref={(g) => grid = g}
                    toolbarClick={toolbarClick}
                >
                    <Inject services={[Page, Sort, Resize, Edit, Toolbar, ExcelExport, PdfExport]}/>
                    <ColumnsDirective>
                        <ColumnDirective field="idNum" isPrimaryKey={true}
                            headerText="Id Number" width="150" textAlign="Right"/>
                        <ColumnDirective field="firstName" allowEditing={false}
                            headerText={"First Name"} width="150" textAlign="Right"/>
                        <ColumnDirective field="lastName" allowEditing={false}
                            headerText={"Last Name"} width="150" textAlign="Right"/>
                        <ColumnDirective field="email1" allowEditing={false}
                            headerText={"Email 1"} width="250" textAlign="Right"/>
                        <ColumnDirective field="email2" allowEditing={false}
                            headerText={"Email 2"} width="250" textAlign="Right"/>
                        <ColumnDirective field="phone1" allowEditing={false}
                            headerText={"Phone 1"} width="150" textAlign="Right"/>
                        <ColumnDirective field="phone2" allowEditing={false}
                            headerText={"Phone 2"} width="150" textAlign="Right"/>
                        <ColumnDirective field="residenceName" allowEditing={false}
                            headerText={"City"} width="150" textAlign="Right"/>
                        <ColumnDirective field="streetName" allowEditing={false}
                            headerText={"Street"} width="150" textAlign="Right"/>
                        <ColumnDirective field="houseNumber" allowEditing={false}
                            headerText={"House Number"} width="150" textAlign="Right"/>
                        <ColumnDirective field="zipCode" allowEditing={false}
                            headerText={"Zip Code"} width="150" textAlign="Right"/>
                        <ColumnDirective field="innerCityBallotId" allowEditing={false}
                            headerText={"Ballot Number"} width="150" textAlign="Right"/>
                        <ColumnDirective field="ballotLocation" allowEditing={false}
                            headerText={"Ballot Location"} width="150" textAlign="Right"/>
                        <ColumnDirective field="ballotAddress" allowEditing={false}
                            headerText={"Ballot Address"} width="150" textAlign="Right"/>
                        <ColumnDirective field="supportStatus" editType="dropdownedit" edit={{
                            params: {
                                allowFiltering: true,
                                dataSource: editNames,
                            }
                        }}
                        headerText={"Support status"} width="150" textAlign="Right"/>
                    </ColumnsDirective>
                </GridComponent>
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
                {!loading && firstSearchDone && !errorLoadingData}
            </Stack>
        </>
    );
}

export default VotersLedgerTab;
