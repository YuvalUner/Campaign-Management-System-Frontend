import React, {useEffect} from "react";
import ImageBbApiRequestMaker from "../../utils/ImageBbApiRequestMaker";
import Campaign from "../../models/campaign";
import Events from "../../utils/events";
import {FormControl} from "@mui/material";
import {DropzoneArea, FileObject} from "mui-file-dropzone";
import fieldsStyle from "./fields.module.css";

interface CampaignLogoUploadFieldProps {
    campaign: React.MutableRefObject<Campaign>;
    setPhotoUploaded: (photoUploaded: boolean) => void;
}

function CampaignLogoUploadField(props: CampaignLogoUploadFieldProps): JSX.Element {

    const [uploadedFile, setUploadedFile] = React.useState<FileObject | null | File>(null);

    const uploadToImgBb = async (): Promise<void> => {
        if (uploadedFile) {
            try {
                const response = await ImageBbApiRequestMaker.uploadImage(uploadedFile as File);
                props.campaign.current.campaignLogoUrl = response.data.data.url;
            } finally {
                props.setPhotoUploaded(true);
            }
        }
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.NewCampaignSubmitted, uploadToImgBb);
        return () => {
            Events.unsubscribe(Events.EventNames.NewCampaignSubmitted, uploadToImgBb);
        };
    }, []);

    return (
        <FormControl sx={{
            width: "500px",
            height: "500px",
        }}>
            <DropzoneArea
                dropzoneClass={fieldsStyle.dropzone}
                acceptedFiles={["image/*"]}
                dropzoneText={"Upload a logo for your campaign"}
                filesLimit={1}
                fileObjects={uploadedFile ? [uploadedFile] : []}
                onChange={(files) => {
                    setUploadedFile(files[0]);
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
                    setUploadedFile(null);
                }}/>
        </FormControl>
    );
}

export default CampaignLogoUploadField;
