import React from "react";
import AnalysisRow from "../../../../../models/analysis-row";
import {ColumnDirective, ColumnsDirective, GridComponent, Resize, Sort} from "@syncfusion/ej2-react-grids";
import {Inject} from "@syncfusion/ej2-react-schedule";

interface AnalysisDetailsSectionTableProps {
    analysisDetails: AnalysisRow[];
}

function AnalysisDetailsSectionTable(props: AnalysisDetailsSectionTableProps): JSX.Element {

    const injectedServices = [Sort, Resize];

    return (
        <GridComponent dataSource={props.analysisDetails} allowPaging={false}
            allowSorting={true} allowResizing={true}
        >
            <Inject services={injectedServices}/>
            <ColumnsDirective>
                <ColumnDirective field="topic" headerText="Topic" width="100"/>
                <ColumnDirective field={"total"} headerText="Total" width="100"/>
                <ColumnDirective field={"positive"} headerText="Positive %" width="100"/>
                <ColumnDirective field={"negative"} headerText="Negative %" width="100"/>
                <ColumnDirective field={"neutral"} headerText="Neutral %" width="100"/>
                <ColumnDirective field={"hate"} headerText="Hate %" width="100"/>
            </ColumnsDirective>
        </GridComponent>
    );
}

export default AnalysisDetailsSectionTable;
