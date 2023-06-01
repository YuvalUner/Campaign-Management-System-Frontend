import React from "react";
import Permission, {PermissionTypes} from "../../../../../models/permission";
import {Box, Stack, Typography} from "@mui/material";
import config from "../../../../../app-config.json";
import ServerRequestMaker from "../../../../../utils/helperMethods/server-request-maker";
import Button from "@mui/material/Button";
import {Spinner} from "react-bootstrap";

interface RecommendationDisplayProps {
    permission: Permission;
    recommendation?: string | null;
    setRecommendation: (recommendation: string | null | undefined) => void;
    resultsGuid: string;
    campaignGuid: string;
    firstFetchMade: boolean;
}

/**
 * This component displays the recommendation for the user to see.
 * It displays it in a way that is similar to ChatGPT, as that is what generated the recommendation.
 * @param props
 * @constructor
 */
function RecommendationDisplay(props: RecommendationDisplayProps): JSX.Element {

    const [generatingRecommendation, setGeneratingRecommendation] = React.useState<boolean>(false);

    const generateResponse = (): void =>  {
        setGeneratingRecommendation(true);
        ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CampaignAdvisor.Base + config.ControllerUrls.CampaignAdvisor.GenerateGptResponse
            + props.campaignGuid + "/" + props.resultsGuid,
            null
        ).then((response) => {
            props.setRecommendation(response.data.response);
        }).finally(() => {
            setGeneratingRecommendation(false);
        });
    };

    const displayRecommendation = (): JSX.Element => {
        if (props.recommendation !== null && props.recommendation !== undefined) {
            return (
                <Typography variant={"body2"}>
                    {props.recommendation}
                </Typography>
            );
        }
        return (
            <>
                {!generatingRecommendation &&
                    <Box>
                    No recommendation generated yet. <br/>
                        {props.permission.permissionType === PermissionTypes.Edit &&
                            <Button onClick={generateResponse}>Generate response</Button>}
                    </Box>
                }
                {generatingRecommendation &&
                    <Stack direction={"column"} spacing={2} alignItems={"center"} justifyContent={"center"} sx={{
                        marginTop: "2rem",
                    }}>
                        <Spinner/>
                        <Typography variant={"h6"}>Generating recommendation</Typography>
                    </Stack>
                }
            </>
        );
    };

    return (
        <Box sx={{
            padding: "1rem"
        }}>
            {props.firstFetchMade?
                displayRecommendation()
                : <Typography variant={"body2"}>Please select a past result first.</Typography>
            }
        </Box>
    );
}

export default RecommendationDisplay;
