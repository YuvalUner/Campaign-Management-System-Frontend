import React from "react";
import {
    ActionEventArgs,
    ColumnDirective,
    ColumnsDirective,
    Edit, EditSettingsModel,
    ExcelExport,
    Filter,
    GridComponent,
    IEditCell,
    Page,
    Resize,
    Sort,
    Toolbar,
} from "@syncfusion/ej2-react-grids";
import {ClickEventArgs} from "@syncfusion/ej2-react-navigations";
import Party from "../../../../../models/party";
import {Alert, Stack} from "@mui/material";
import {Inject} from "@syncfusion/ej2-react-schedule";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import config from "../../../../../app-config.json";
import Events from "../../../../../utils/helperMethods/events";

interface PartiesTableProps {
    editable: boolean;
    parties: Party[];
    campaignGuid: string;
    changesMade: React.MutableRefObject<boolean>;
}

function PartiesTable(props: PartiesTableProps): JSX.Element {

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

    const onActionComplete = (args: ActionEventArgs) => {
        if (args.requestType === "save"){
            props.changesMade.current = true;
            setError("");
            const data: Party = args.data as Party;
            if (args.action === "add"){
                ServerRequestMaker.MakePostRequest(
                    config.ControllerUrls.Parties.Base + config.ControllerUrls.Parties.AddParty + props.campaignGuid,
                    data,
                ).finally(() => {
                    Events.dispatch(Events.EventNames.ShouldRefreshPartyList);
                });
            } else if (args.action === "edit"){
                ServerRequestMaker.MakePutRequest(
                    config.ControllerUrls.Parties.Base + config.ControllerUrls.Parties.UpdateParty
                    + props.campaignGuid,
                    data,
                ).catch(() => {
                    Events.dispatch(Events.EventNames.ShouldRefreshPartyList);
                });
            }
        } else if (args.requestType === "delete"){
            props.changesMade.current = true;
            setError("");
            if (args.data !== undefined && args.data instanceof Array && args.data.length > 0
                && args.data[0] !== undefined) {
                const data: Party = args.data[0] as Party;
                ServerRequestMaker.MakeDeleteRequest(
                    config.ControllerUrls.Parties.Base + config.ControllerUrls.Parties.DeleteParty
                    + props.campaignGuid + "/" + data.partyId,
                ).catch(() => {
                    setError("An error occurred");
                    Events.dispatch(Events.EventNames.ShouldRefreshPartyList);
                });
            } else{
                setError("An error occurred");
            }
        }
    };

    return (
        <Stack direction={"column"} spacing={2}>
            <GridComponent
                dataSource={props.parties}
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
                    <ColumnDirective field={"partyId"} headerText={"Party Id"} width={"100px"} isPrimaryKey={true}
                        visible={false}/>
                    <ColumnDirective field={"partyName"} headerText={"Party Name"} width={"100px"}
                        edit={numericParams} validationRules={{
                            required: true,
                        }}/>
                    <ColumnDirective field={"partyLetter"} headerText={"Party Letter"} width={"100px"}
                        validationRules={{
                            required: true,
                            maxLength: 5
                        }}
                    />
                </ColumnsDirective>
            </GridComponent>
            {error !== "" && <Alert severity={"error"}>{error}</Alert>}
        </Stack>
    );
}

export default PartiesTable;
