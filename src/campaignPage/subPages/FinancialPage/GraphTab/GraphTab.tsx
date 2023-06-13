import React from "react";
import {Balance2} from "../../../../models/financialSummary";
import {
    Tooltip,
    AxisModel,
    Category,
    ChartComponent,
    DataLabel,
    DateTime,
    Inject,
    SeriesCollectionDirective,
    SeriesDirective,
    StepLineSeries,
} from "@syncfusion/ej2-react-charts";

interface GraphPageProps {
    balances: Balance2[] | null;
}

export const GraphTab = (props: GraphPageProps) => {
    const marker = {
        visible: true, width: 10, height: 10, border: {width: 2, color: "#F8AB1D"},
        dataLabel: {
            visible: true, margin: {
                left: 3,
                right: 3,
                top: 3,
                bottom: 3,
            },
        },
    };
    const primaryxAxis: AxisModel = {
        valueType: "DateTime",
        title: "Date",
        labelFormat: "dd/MMM/y",
        intervalType: "Auto",
        rangePadding: "Round",
    };
    const tooltip = {enable: true, format: "${point.y} on ${point.x}"};
    const primaryyAxis: AxisModel = {title: "Balance", labelFormat: "c"};

    return (
        <>
            <ChartComponent id="charts" primaryXAxis={primaryxAxis} primaryYAxis={primaryyAxis} tooltip={tooltip}>
                <Inject services={[StepLineSeries, Tooltip, DataLabel, Category, DateTime]}/>

                <SeriesCollectionDirective>
                <SeriesDirective dataSource={props.balances ?? []} xName="date" yName="balance" width={2}
                                     name="BALANCE"
                                     type="StepLine" marker={marker}>
                    </SeriesDirective>
                </SeriesCollectionDirective>
            </ChartComponent>;

        </>
    );
};
