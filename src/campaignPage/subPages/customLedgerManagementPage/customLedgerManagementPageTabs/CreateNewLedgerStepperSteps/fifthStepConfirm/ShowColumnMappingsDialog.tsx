import React from "react";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {ColumnDirective, ColumnsDirective, GridComponent} from "@syncfusion/ej2-react-grids";
import ColumnMapping from "../../../../../../models/column-mapping";

interface ShowColumnMappingsDialogProps {
    openDialog: boolean;
    setOpenDialog: (openDialog: boolean) => void;
    columnMappings: ColumnMapping[];
}

function ShowColumnMappingsDialog(props: ShowColumnMappingsDialogProps): JSX.Element {
    const closeDialog = () => {
        props.setOpenDialog(false);
    };

    return (
        <Dialog open={props.openDialog} onClose={closeDialog}>
            <DialogContent>
                <GridComponent
                    dataSource={props.columnMappings}
                    allowResizing={true}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="propertyName"
                            headerText="Property Name" width="200" textAlign="Center"/>
                        <ColumnDirective field="columnName"
                            headerText={"Column Name"} width="200" textAlign="Center"/>
                    </ColumnsDirective>
                </GridComponent>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShowColumnMappingsDialog;
