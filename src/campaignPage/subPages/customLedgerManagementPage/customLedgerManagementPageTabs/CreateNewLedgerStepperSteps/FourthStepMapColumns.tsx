import React, {useEffect} from "react";
import {Alert, Stack, Typography} from "@mui/material";
import ColumnMapping, {PropertyNames} from "../../../../../models/column-mapping";
import {FileObject} from "mui-file-dropzone";
import {
    ActionEventArgs,
    ColumnDirective,
    ColumnsDirective,
    Edit,
    EditSettingsModel,
    GridComponent,
} from "@syncfusion/ej2-react-grids";
import {Inject} from "@syncfusion/ej2-react-schedule";

interface FourthStepMapColumnsProps {
    columnMappings: ColumnMapping[];
    setColumnMappings: (columnMappings: ColumnMapping[]) => void;
    file: File | null | FileObject;
    shouldCheckForError: React.MutableRefObject<boolean>;
    shouldDisplayError: boolean;
    setShouldDisplayError: (shouldDisplayError: boolean) => void;
}

function FourthStepMapColumns(props: FourthStepMapColumnsProps): JSX.Element {

    const editOptions: EditSettingsModel = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
    };

    const onActionComplete = (args: ActionEventArgs) => {
        if (args.requestType === "save") {
            if (args.primaryKeyValue && args.data && args.primaryKeyValue.length > 0) {
                const propName = args.primaryKeyValue[0];
                const row = args.data as { columnName: string };
                const columnMapping = props.columnMappings.find((clm) => clm.propertyName === propName);
                if (columnMapping === undefined) {
                    return;
                }
                columnMapping.columnName = row.columnName;
                props.setColumnMappings([...props.columnMappings]);
                if (propName === PropertyNames.identifier) {
                    props.setShouldDisplayError(row.columnName === "");
                }
            }
        }
    };

    useEffect(() => {
        props.shouldCheckForError.current = true;
        return () => {
            props.shouldCheckForError.current = false;
            props.setShouldDisplayError(false);
        };
    }, []);

    return (
        <Stack spacing={2} direction={"column"} sx={{
            width: "100%",
            height: "100%",
        }}>
            <Typography variant={"body1"}>
              In this page, you can map the columns of your file to our specifications.<br/>
              Please note that any column that is not mapped will be ignored.<br/>
            </Typography>
            <GridComponent
                dataSource={props.columnMappings}
                allowSorting={true}
                allowResizing={true}
                editSettings={editOptions}
                actionComplete={onActionComplete}
                height={350}
                width={"100%"}
            >
                <Inject services={[Edit]}/>
                <ColumnsDirective>
                    <ColumnDirective field="propertyName" isPrimaryKey={true}
                        headerText="Property Name" width="200" textAlign="Center"/>
                    <ColumnDirective field="columnName" allowEditing={true}
                        headerText={"Column Name"} width="200" textAlign="Center"/>
                </ColumnsDirective>
            </GridComponent>
            {props.shouldDisplayError && <Alert severity={"error"}>Identifier field must be mapped to a column.</Alert>}
        </Stack>
    );
}

export default FourthStepMapColumns;
