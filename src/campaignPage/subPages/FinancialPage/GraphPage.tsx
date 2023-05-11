import React from "react";
import FinancialType from "../../../models/financialType";
import {FinancialSummary} from "../../../models/financialSummary";
// import {AxisModel, ChartComponent, SeriesCollectionDirective, SeriesDirective} from "@syncfusion/ej2-react-charts";
import {Inject} from "@syncfusion/ej2-react-base";
import {DateTime, LineSeries, Tooltip} from "@syncfusion/ej2/charts";

interface GraphPageProps {
    transactionTypes: FinancialType[] | null;
    transactions: FinancialSummary | null;
}

export const GraphPage = (props: GraphPageProps) => {
    // console.dir(props.transactions?.balances);

    // const primaryxAxis: AxisModel = {minimum: 0, maximum: (props.transactions?.balances.length ?? 0) + 1, visible:false};
    return (
        <div className="control-pane">
            <div className="control-section">
                PlaceHolder
                {/*<ChartComponent id="stockchartspline" title="Balance" primaryXAxis={primaryxAxis}>*/}
                {/*    <Inject*/}
                {/*        services={[LineSeries, DateTime, Tooltip]}/>*/}
                {/*    <SeriesCollectionDirective>*/}
                {/*        <SeriesDirective dataSource={props.transactions?.balances} xName="x" yName="balance"*/}
                {/*                         marker={{dataLabel: {visible: true}}}/>*/}
                {/*    </SeriesCollectionDirective>*/}
                {/*</ChartComponent>*/}
            </div>
        </div>
    );
};