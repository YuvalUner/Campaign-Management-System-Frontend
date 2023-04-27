import React, {useRef, useState} from "react";
import SubPageWithPermissionBaseProps from "../../utils/sub-page-with-permission-base-props";
import VotersLedgerFilter from "../../../models/voters-ledger-filter";
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import IdNumberField from "./votersLedgerPageFields/IdNumberField";
import FieldKeys from "./votersLedgerPageFields/utils/field-keys";
import FirstNameField from "./votersLedgerPageFields/FirstNameField";
import LastNameField from "./votersLedgerPageFields/LastNameField";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import StreetNameField from "./votersLedgerPageFields/StreetNameField";
import BallotNumberField from "./votersLedgerPageFields/BallotNumberField";
import SupportStatusField from "./votersLedgerPageFields/SupportStatusField";
import SearchIcon from "@mui/icons-material/Search";
import VotersLedgerFilterRecord from "../../../models/voters-ledger-filter-record";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {
    ActionEventArgs,
    ColumnDirective,
    ColumnsDirective, Edit, EditSettingsModel, ExcelExport, Filter,
    GridComponent,
    Page,
    Resize,
    Sort, Toolbar,
} from "@syncfusion/ej2-react-grids";
import {useParams} from "react-router-dom";
import {Inject} from "@syncfusion/ej2-react-schedule";
import {ClickEventArgs} from "@syncfusion/ej2-react-navigations";
import {PermissionTypes} from "../../../models/permission";

function VotersLedgerPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    let gridInstance: GridComponent | null;

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

    const injectedServices = props.permission.permissionType === PermissionTypes.Edit ?
        [Page, Sort, Resize, Edit, Toolbar, ExcelExport, Filter]
        : [Page, Sort, Resize, Toolbar, ExcelExport, Filter];

    const toolbarOptions = props.permission.permissionType === PermissionTypes.Edit ?
        ["Edit", "ExcelExport"]
        : ["ExcelExport"];

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

    const mapSupportStatusToString = (supportStatus: boolean | null) => {
        if (supportStatus) {
            return "Supporting";
        } else if (supportStatus === false) {
            return "Opposing";
        }
        return "Unknown";
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
            res.data.forEach((record: VotersLedgerFilterRecord) => {
                record.supportStatusString = mapSupportStatusToString(record.supportStatus);
            });
            setSearchResults(res.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setErrorLoadingData(true);
        });
    };

    const editOptions: EditSettingsModel =
        {
            allowEditing: props.permission.permissionType === PermissionTypes.Edit,
            allowAdding: false, allowDeleting: false,
        };

    const toolbarClick = (args: ClickEventArgs) => {
        // eslint-disable-next-line default-case
        switch (args.item.text) {
        case "Excel Export":
            gridInstance?.excelExport();
            break;
        }
    };

    const mapToBool = (value: string) => {
        if (value === "Supporting") {
            return true;
        } else if (value === "Opposing") {
            return false;
        }
        return null;
    };

    const onActionComplete = (args: ActionEventArgs) => {
        if (args.requestType === "save" && props.permission.permissionType === PermissionTypes.Edit) {
            if (args.primaryKeyValue && args.data && args.primaryKeyValue.length > 0) {
                const idNum = args.primaryKeyValue[0];
                const row = args.data as { supportStatusString: string };
                const newSupportStatus = mapToBool(row.supportStatusString);
                ServerRequestMaker.MakePutRequest(
                    config.ControllerUrls.VotersLedger.Base + config.ControllerUrls.VotersLedger.UpdateSupportStatus
                    + campaignGuid,
                    {
                        idNum: idNum,
                        supportStatus: newSupportStatus,
                    },
                );
            }
        }
    };


    return (

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
                ref={(g) => gridInstance = g}
                toolbarClick={toolbarClick}
                allowExcelExport={true}
                allowReordering={true}
                actionComplete={onActionComplete}
                allowFiltering={true}
            >
                <Inject services={injectedServices}/>
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
                    <ColumnDirective field="appartment" allowEditing={false}
                        headerText={"Apartment"} width="150" textAlign="Right"/>
                    <ColumnDirective field="houseLetter" allowEditing={false}
                        headerText={"House Letter"} width="150" textAlign="Right"/>
                    <ColumnDirective field="zipCode" allowEditing={false}
                        headerText={"Zip Code"} width="150" textAlign="Right"/>
                    <ColumnDirective field="innerCityBallotId" allowEditing={false}
                        headerText={"Ballot Number"} width="150" textAlign="Right"/>
                    <ColumnDirective field="ballotLocation" allowEditing={false}
                        headerText={"Ballot Location"} width="150" textAlign="Right"/>
                    <ColumnDirective field="ballotAddress" allowEditing={false}
                        headerText={"Ballot Address"} width="150" textAlign="Right"/>
                    <ColumnDirective field="supportStatusString" editType="dropdownedit"
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
    );
}

export default VotersLedgerPage;
