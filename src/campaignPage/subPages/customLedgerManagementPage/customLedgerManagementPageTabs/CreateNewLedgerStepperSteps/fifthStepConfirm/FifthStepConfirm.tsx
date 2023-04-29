import React from "react";
import {Button, Stack, Table, TableCell, TableRow, Typography} from "@mui/material";
import {FileObject} from "mui-file-dropzone";
import ColumnMapping from "../../../../../../models/column-mapping";
import ShowColumnMappingsDialog from "./ShowColumnMappingsDialog";

interface FifthStepConfirmAndUploadProps {
    file: File | null | FileObject;
    ledgerName: string;
    columnMappings: ColumnMapping[];
}

function FifthStepConfirmAndUpload(props: FifthStepConfirmAndUploadProps): JSX.Element {

    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const getFileName = (): string => {
        if (props.file === null) {
            return "";
        }
        if (props.file instanceof File) {
            return props.file.name;
        }
        return props.file.file.name;
    };

    return (
        <>
            <Stack direction={"column"} spacing={2}>
                <Typography variant={"body1"}>Please confirm that the following information is correct:</Typography>
                <Table>
                    <TableRow>
                        <TableCell>Ledger name:</TableCell>
                        <TableCell>{props.ledgerName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>File:</TableCell>
                        <TableCell>{getFileName()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Column mappings:</TableCell>
                        <TableCell>
                            <Button variant={"text"} onClick={() => setOpenDialog(true)} sx={{
                                textTransform: "none",
                                paddingLeft: "0px",
                            }}>
                                Click here to view
                            </Button>
                        </TableCell>
                    </TableRow>
                </Table>
            </Stack>
            <ShowColumnMappingsDialog openDialog={openDialog} setOpenDialog={setOpenDialog}
                columnMappings={props.columnMappings}/>
        </>
    );
}

export default FifthStepConfirmAndUpload;
