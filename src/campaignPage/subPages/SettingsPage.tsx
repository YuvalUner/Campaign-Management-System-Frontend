import React, {useEffect, useRef, useState} from "react";
import Campaign from "../../models/campaign";
import {Button, Stack, TextField, Typography} from "@mui/material";
import Constants from "../../utils/constantsAndStaticObjects/constants";
import Grid2 from "@mui/material/Unstable_Grid2";
import CampaignNameField from "../../createCampaignPage/formFields/CampaignNameField";
import CampaignDescriptionField from "../../createCampaignPage/formFields/CampaignDescriptionField";
import CampaignLogoUploadField from "../../createCampaignPage/formFields/CampaignLogoUploadField";
import {FileObject} from "mui-file-dropzone";
import ImageBbApiRequestMaker from "../../utils/helperMethods/image-bb-api-request-maker";
import {HttpStatusCode} from "axios";
import ServerRequestMaker from "../../utils/helperMethods/server-request-maker";
import config from "../../app-config.json";
import Events from "../../utils/helperMethods/events";

interface SettingsPageProps {
    campaign: Campaign | null;
    setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>;
}

function SettingsPage(props: SettingsPageProps): JSX.Element {
    const [uploadedFile, setUploadedFile] = useState<File | null | FileObject>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const campaignRef = useRef<Campaign>({...(props.campaign)});

    const createLinkFromInviteGuid = (inviteGuid:string) => {
        return `${window.location.origin}/accept-invite/${inviteGuid}`;
    };

    const getInviteLink = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Invites.Base + config.ControllerUrls.Invites.GetInvite + props.campaign?.campaignGuid,
        );
        if (res.status === HttpStatusCode.Ok) {
            setInviteLink(createLinkFromInviteGuid(res.data.inviteGuid));
        }
    };

    const updateInviteLink = async () => {
        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Invites.Base + config.ControllerUrls.Invites.UpdateInvite + props.campaign?.campaignGuid,
            {},
        );
    };

    const revokeInviteLink = async () => {
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.Invites.Base + config.ControllerUrls.Invites.RevokeInvite + props.campaign?.campaignGuid,
        );
        if (res.status === HttpStatusCode.Ok) {
            setInviteLink(null);
        }
    };

    useEffect(() => {
        getInviteLink();
    }, []);

    const uploadToImgBb = async (): Promise<void> => {
        if (uploadedFile) {
            const response = await ImageBbApiRequestMaker.uploadImage(uploadedFile as File);
            if (response.status === HttpStatusCode.Ok) {
                campaignRef.current.campaignLogoUrl = response.data.data.url;
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        await uploadToImgBb();
        const res = await ServerRequestMaker.MakePutRequest(
            config.ControllerUrls.Campaigns.Base + config.ControllerUrls.Campaigns.UpdateCampaign + props.campaign?.campaignGuid,
            campaignRef.current,
        );
        if (res.status === HttpStatusCode.Ok) {
            props.setCampaign((prev) => {
                const newCampaign: Campaign = {...prev};
                newCampaign.campaignLogoUrl = campaignRef.current.campaignLogoUrl;
                newCampaign.campaignDescription = campaignRef.current.campaignDescription;
                return newCampaign;
            });
            Events.dispatch(Events.EventNames.RefreshCampaignsList);
        }
    };

    const onCopyClick = async () => {
        if (inviteLink !== null) {
            await navigator.clipboard.writeText(inviteLink);
        }
    };

    const onResetClick = async () => {
        await updateInviteLink();
        await getInviteLink();
    };

    const onRevokeClick = async () => {
        await revokeInviteLink();
    };

    return (
        <Stack component={"form"} direction={"column"} onSubmit={handleSubmit} spacing={3} sx={{
            marginRight: `${Constants.muiBoxDefaultPadding * 5}px`,
            marginLeft: `${Constants.muiBoxDefaultPadding * 5}px`,
        }}>
            <Stack direction={"column"} spacing={3}>
                <Typography variant={"h4"}>
                    Update campaign info
                </Typography>
                <Grid2 container spacing={10}>
                    <Grid2 xs={12} md={6}>
                        <Stack direction={"column"} spacing={6}>
                            <CampaignNameField campaign={campaignRef} defaultValue={props.campaign?.campaignName}
                                InputProps={{
                                    readOnly: true,
                                }}/>
                            <CampaignDescriptionField campaign={campaignRef}
                                defaultValue={props.campaign?.campaignDescription}/>
                        </Stack>
                    </Grid2>
                    <Grid2 xs={12} md={6}>
                        <CampaignLogoUploadField campaign={campaignRef}
                            uploadedFile={uploadedFile}
                            setUploadedFile={setUploadedFile}
                            dimensions={{
                                width: "500px",
                                height: "250px",
                            }}
                        />
                    </Grid2>
                </Grid2>
                <Button variant={"contained"} type={"submit"}>Update</Button>
                <TextField
                    label="Invite Link"
                    value={inviteLink ?? "No link, click create link button bellow"}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Grid2 container spacing={10}>
                    <Grid2 xs={12} md>
                        <Button variant={"contained"} onClick={onCopyClick} disabled={inviteLink === null}>Copy
                            Invite</Button>
                    </Grid2>
                    <Grid2 xs={12} md>
                        <Button variant={"contained"}
                            onClick={onResetClick}>{inviteLink === null ? "Create Link" : "Reset Link"}</Button>
                    </Grid2>
                    <Grid2 xs={12} md>
                        <Button variant={"contained"} onClick={onRevokeClick} disabled={inviteLink === null}>Remove
                            Link</Button>
                    </Grid2>
                </Grid2>
            </Stack>
        </Stack>
    );
}

export default SettingsPage;