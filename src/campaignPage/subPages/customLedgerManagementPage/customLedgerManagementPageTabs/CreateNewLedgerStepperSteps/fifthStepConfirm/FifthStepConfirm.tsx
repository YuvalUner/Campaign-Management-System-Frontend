import React from "react";
import {Button, Stack, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {FileObject} from "mui-file-dropzone";
import ColumnMapping from "../../../../../../models/column-mapping";
import ShowColumnMappingsDialog from "./ShowColumnMappingsDialog";
import {FirstStepChooseActionEnum} from "../FirstStepChooseAction";

interface FifthStepConfirmAndUploadProps {
    file: File | null | FileObject;
    ledgerName: string;
    columnMappings: ColumnMapping[];
    selectedAction?: FirstStepChooseActionEnum;
    shouldDeleteOnUnmatch?: boolean;
}

function FifthStepConfirmAndUpload(props: FifthStepConfirmAndUploadProps): JSX.Element {

    const [openMappingPreviewDialog, setOpenMappingPreviewDialog] = React.useState<boolean>(false);

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
                    <TableBody>
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
                                <Button variant={"text"} onClick={() => setOpenMappingPreviewDialog(true)} sx={{
                                    textTransform: "none",
                                    paddingLeft: "0px",
                                }}>
                                    Click here to view
                                </Button>
                            </TableCell>
                        </TableRow>
                        {props.selectedAction === FirstStepChooseActionEnum.Existing
                            && <TableRow>
                                <TableCell>Delete un-matched rows:</TableCell>
                                <TableCell>{props.shouldDeleteOnUnmatch? "Yes" : "No"}</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </Stack>
            <ShowColumnMappingsDialog openDialog={openMappingPreviewDialog} setOpenDialog={setOpenMappingPreviewDialog}
                columnMappings={props.columnMappings}/>
        </>
    );
}

export default FifthStepConfirmAndUpload;
