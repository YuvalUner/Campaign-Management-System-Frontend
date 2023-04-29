import React, {useEffect} from "react";
import {Alert, Box, Button, Stack, Typography} from "@mui/material";
import DisplayExampleDialog from "./DisplayExampleDialog";
import {DropzoneArea, FileObject} from "mui-file-dropzone";
import styling from "./thirdStepSelectFile.module.css";

interface ThirdStepSelectFileProps {
    uploadedFile: File | null | FileObject;
    setUploadedFile: (uploadedFile: File | null | FileObject) => void;
    shouldDisplayError: boolean;
    setShouldDisplayError: (shouldDisplayError: boolean) => void;
    shouldCheckForError: React.MutableRefObject<boolean>;
}

function ThirdStepSelectFile(props: ThirdStepSelectFileProps): JSX.Element {

    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        props.setUploadedFile(null);
        props.shouldCheckForError.current = true;
        return () => {
            props.shouldCheckForError.current = false;
            props.setShouldDisplayError(false);
        };
    }, []);

    return (
        <>
            <Stack direction={"column"} spacing={5} sx={{
                marginTop: "2rem",
            }}>
                <Box>
                    <Typography variant={"body1"}>
                        Please choose an Excel file to import.<br/>
                        The file must obey the following rules:
                    </Typography>
                    <ul>
                        <li>Have a column of unique, identifying numbers for each row</li>
                        <li>If there is a support status column, all values in it must be either empty,
                            or one of the following: &#34;supporting&#34;, &#34;opposing&#34;, &#34;unknown&#34;,
                            &#34;true&#34;, &#34;false&#34;. This is not case sensitive.</li>
                        <li>The file must have a header row.</li>
                    </ul>
                    <Typography variant={"body1"}>
                        Click <Button variant={"text"} sx={{textTransform: "none"}}
                            onClick={() => setOpenDialog(true)}>here</Button>
                        to see an example of how the uploaded data will look after it has been imported.<br/>
                        Even if the columns do not match the example, you will be able to map the columns of your file
                        to our requirements on the next page.<br/>
                        All columns but the identifying number column are optional.<br/>
                    </Typography>
                </Box>
            </Stack>
            <DropzoneArea
                dropzoneClass={styling.dropzone}
                acceptedFiles={[".xlsx", ".xls"]}
                dropzoneText={"Upload a file to import"}
                filesLimit={1}
                fileObjects={props.uploadedFile ? [props.uploadedFile] : []}
                onChange={(files) => {
                    props.setUploadedFile(files[0]);
                    props.setShouldDisplayError(false);
                }}

                showPreviewsInDropzone={true}
                showAlerts={false}
                onDelete={() => {
                    props.setUploadedFile(null);
                }}
                getPreviewIcon={(fileObject) => {
                    return <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{
                        height: "60px",
                        width: "60px",
                        marginBottom: "150px",
                        objectFit: "contain"
                    }}>
                        <img alt={"preview"} src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/" +
                        "34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/826px-Microsoft_Office_Excel_" +
                        "%282019%E2%80%93present%29.svg.png"} style={{
                            height: "100px",
                            marginBottom: "60px",
                        }} role={"presentation"}/>
                        <Typography variant={"body1"} sx={{
                            textAlign: "center",
                            marginBottom: "60px",
                        }}>
                            {fileObject.file.name}
                        </Typography>
                    </Stack>;
                }}
            />
            {props.shouldDisplayError && <Alert severity={"error"}>Please upload a file to proceed</Alert>}
            <DisplayExampleDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
        </>
    );
}

export default ThirdStepSelectFile;
