import React from "react";
import {
    ColumnDirective,
    ColumnsDirective,
    Edit, EditSettingsModel,
    ExcelExport,
    Filter,
    GridComponent,
    Page,
    Resize,
    Sort,
    Toolbar,
} from "@syncfusion/ej2-react-grids";
import {ClickEventArgs} from "@syncfusion/ej2-react-navigations";
import Ballot from "../../../../../models/ballot";
import {Inject} from "@syncfusion/ej2-react-schedule";
import BallotEditDialog from "./BallotEditDialog";

interface BallotsTableProps {
    editable: boolean;
    ballots: Ballot[];
}

function BallotsTable(props: BallotsTableProps): JSX.Element {

    let gridInstance: GridComponent | null;

    const injectedServices = props.editable ?
        [Page, Sort, Resize, Edit, Toolbar, ExcelExport, Filter]
        : [Page, Sort, Resize, Toolbar, ExcelExport, Filter];

    const toolbarOptions = props.editable ?
        ["Edit", "Add", "Delete", "ExcelExport"]
        : ["ExcelExport"];

    const toolbarClick = (args: ClickEventArgs) => {
        // eslint-disable-next-line default-case
        switch (args.item.text) {
        case "Excel Export":
            gridInstance?.excelExport();
            break;
        }
    };

    const dialogTemplate = (props: any) => {
        return <BallotEditDialog {...props}/>;
    };

    const editOptions: EditSettingsModel = {
        allowEditing: props.editable,
        allowAdding: props.editable,
        allowDeleting: props.editable,
        mode: "Dialog",
        template: dialogTemplate,
    };

    return (
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
        >
            <Inject services={injectedServices}/>
            <ColumnsDirective>
                <ColumnDirective field={"ballotId"} headerText={"Ballot ID"} isPrimaryKey={true} width={"100px"}/>
                <ColumnDirective field={"cityName"} headerText={"City Name"} width={"100px"}/>
                <ColumnDirective field={"innerCityBallotId"} headerText={"Ballot Number"} width={"100px"}/>
                <ColumnDirective field={"ballotLocation"} headerText={"Ballot Location"} width={"100px"}/>
                <ColumnDirective field={"ballotAddress"} headerText={"Ballot Address"} width={"100px"}/>
                <ColumnDirective field={"accessible"} headerText={"Accessible"} width={"100px"}/>
            </ColumnsDirective>
        </GridComponent>
    );
}

export default BallotsTable;
