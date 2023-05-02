import React from "react";
import Campaign from "../../models/campaign";
import {FormControl, Typography} from "@mui/material";
import {DropzoneArea, FileObject} from "mui-file-dropzone";
import fieldsStyle from "./fields.module.css";

type Dimensions = {
    width: string,
    height: string,
}

interface CampaignLogoUploadFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    uploadedFile: FileObject | null | File;
    setUploadedFile: (uploadedFile: FileObject | null | File) => void;
    dimensions?:Dimensions;
}

function CampaignLogoUploadField(props: CampaignLogoUploadFieldProps): JSX.Element {
    const dimensions = props.dimensions ?? {
        width: "500px",
        height: "500px",
    };

    return (
        <FormControl sx={dimensions}>
            <DropzoneArea
                dropzoneClass={fieldsStyle.dropzone}
                acceptedFiles={["image/*"]}
                dropzoneText={"Upload a logo for your campaign"}
                filesLimit={1}
                fileObjects={props.uploadedFile ? [props.uploadedFile] : []}
                onChange={(files) => {
                    props.setUploadedFile(files[0]);
                }}

                showPreviewsInDropzone={true}
                showPreviews={false}
                getPreviewIcon={(fileObject) => {
                    return <img alt={props.campaign.current.campaignName} src={fileObject.data as string} style={{
                        height: "400px",
                        width: "500px",
                        objectFit: "contain",
                    }} role={"presentation"}/>;
                }}
                showAlerts={false}
                onDelete={() => {
                    props.setUploadedFile(null);
                }}/>
            <Typography variant={"caption"}>
                * It is recommended to choose a small image and clear image, as it will be displayed as the
                avatar for your campaign.
            </Typography>
        </FormControl>
    );
}

export default CampaignLogoUploadField;