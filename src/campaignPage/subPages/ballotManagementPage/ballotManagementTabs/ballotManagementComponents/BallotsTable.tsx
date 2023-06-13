import React from "react";
import {
    ActionEventArgs,
    ColumnDirective,
    ColumnsDirective,
    Edit, EditSettingsModel,
    ExcelExport,
    Filter,
    GridComponent, IEditCell,
    Page,
    Resize,
    Sort,
    Toolbar,
} from "@syncfusion/ej2-react-grids";
import {ClickEventArgs} from "@syncfusion/ej2-react-navigations";
import Ballot from "../../../../../models/ballot";
import {Inject} from "@syncfusion/ej2-react-schedule";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import {Alert, Stack} from "@mui/material";
import CustomStatusCode from "../../../../../utils/constantsAndStaticObjects/custom-status-code";
import ErrorCodeExtractor from "../../../../../utils/helperMethods/error-code-extractor";
import Events from "../../../../../utils/helperMethods/events";

interface BallotsTableProps {
    editable: boolean;
    ballots: Ballot[];
    campaignGuid: string;
    changesMade: React.MutableRefObject<boolean>;
}

function BallotsTable(props: BallotsTableProps): JSX.Element {

    let gridInstance: GridComponent | null;

    const [error, setError] = React.useState<string>("");

    const injectedServices = props.editable ?
        [Page, Sort, Resize, Edit, Toolbar, ExcelExport, Filter]
        : [Page, Sort, Resize, Toolbar, ExcelExport, Filter];

    const toolbarOptions = props.editable ?
        ["Edit", "Add", "Delete", "ExcelExport"]
        : ["ExcelExport"];

    const numericParams: IEditCell = {
        params: {
            decimals: 2,
        }
    };

    const toolbarClick = (args: ClickEventArgs) => {
        // eslint-disable-next-line default-case
        switch (args.item.text) {
        case "Excel Export":
            gridInstance?.excelExport();
            break;
        }
    };

    const editOptions: EditSettingsModel = {
        allowEditing: props.editable,
        allowAdding: props.editable,
        allowDeleting: props.editable,
    };

    const fitErrorMessage = (e: { response: { data: string | null; }; }) : void => {
        const errorCode: number = (ErrorCodeExtractor(e.response.data));

        switch (errorCode) {
        case CustomStatusCode.DuplicateKey:
            setError("Ballot with this number already exists in this campaign");
            break;
        default:
            setError("An error occurred");
            break;
        }
    };

    const onActionComplete = (args: ActionEventArgs) => {
        if (args.requestType === "save"){
            props.changesMade.current = true;
            setError("");
            const data: Ballot = args.data as Ballot;
            if (args.action === "add"){
                ServerRequestMaker.MakePostRequest(
                    config.ControllerUrls.Ballots.Base + config.ControllerUrls.Ballots.AddBallot + props.campaignGuid,
                    data,
                ).catch((e) => {
                    fitErrorMessage(e);
                    Events.dispatch(Events.EventNames.ShouldRefreshBallotsList);
                });
            } else if (args.action === "edit"){
                ServerRequestMaker.MakePutRequest(
                    config.ControllerUrls.Ballots.Base + config.ControllerUrls.Ballots.UpdateBallot
                    + props.campaignGuid,
                    data,
                ).catch((e) => {
                    fitErrorMessage(e);
                    Events.dispatch(Events.EventNames.ShouldRefreshBallotsList);
                });
            }
        } else if (args.requestType === "delete"){
            props.changesMade.current = true;
            setError("");
            if (args.data !== undefined && args.data instanceof Array && args.data.length > 0
                && args.data[0] !== undefined) {
                const data: Ballot = args.data[0] as Ballot;
                ServerRequestMaker.MakeDeleteRequest(
                    config.ControllerUrls.Ballots.Base + config.ControllerUrls.Ballots.DeleteBallot
                    + props.campaignGuid + "/" + data.innerCityBallotId,
                ).catch(() => {
                    setError("An error occurred");
                    Events.dispatch(Events.EventNames.ShouldRefreshBallotsList);
                });
            } else{
                setError("An error occurred");
            }
        }
    };

    return (
        <Stack direction={"column"} spacing={2}>
            <GridComponent
                dataSource={props.ballots}
                allowPaging={true}
                allowSorting={true}
                allowResizing={true}
                allowFiltering={true}
                allowExcelExport={true}
                allowTextWrap={true}
                toolbar={toolbarOptions}
                toolbarClick={toolbarClick}
                ref={(g) => gridInstance = g}
                editSettings={editOptions}
                actionComplete={onActionComplete}
            >
                <Inject services={injectedServices}/>
                <ColumnsDirective>
                    <ColumnDirective field={"innerCityBallotId"} headerText={"Ballot Number"} width={"100px"}
                        editType={"numericedit"} edit={numericParams} isPrimaryKey={true}
                        validationRules={{required: true, number: true}}
                    />
                    <ColumnDirective field={"cityName"} headerText={"City Name"} width={"100px"}/>
                    <ColumnDirective field={"ballotLocation"} headerText={"Ballot Location"} width={"100px"}/>
                    <ColumnDirective field={"ballotAddress"} headerText={"Ballot Address"} width={"100px"}/>
                    <ColumnDirective field={"accessible"} headerText={"Accessible"} width={"100px"}/>
                </ColumnsDirective>
            </GridComponent>
            {error !== "" && <Alert severity={"error"}>{error}</Alert>}
        </Stack>
    );
}

export default BallotsTable;
