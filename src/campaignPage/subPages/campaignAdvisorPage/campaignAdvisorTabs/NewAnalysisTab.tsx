import React, {FormEvent} from "react";
import {Alert, Box, IconButton, Stack, Tooltip} from "@mui/material";
import TabTextField from "./tabComponents/TabTextField";
import FieldNames from "./field-names";
import {Button, Form} from "react-bootstrap";
import InfoIcon from "@mui/icons-material/Info";
import AdvisorResults from "../../../../models/advisor-results";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import AnalysisParams from "../../../../models/analysis-params";
import ResultsDisplay from "./tabComponents/ResultsDisplay";
import Permission from "../../../../models/permission";
import Events from "../../../../utils/helperMethods/events";

interface NewAnalysisTabProps {
    campaignGuid: string;
    permission: Permission;
}

function NewAnalysisTab(props: NewAnalysisTabProps): JSX.Element {

    const [opponentName, setOpponentName] = React.useState<string>("");
    const [twitterHandle, setTwitterHandle] = React.useState<string>("");
    const [maxDaysBack, setMaxDaysBack] = React.useState<string>("");
    const [analysisTitle, setAnalysisTitle] = React.useState<string>("");
    const [additionalUserRequests, setAdditionalUserRequests] = React.useState<string>("");
    const [lockFields, setLockFields] = React.useState<boolean>(false);
    const [analysisLoading, setAnalysisLoading] = React.useState<boolean>(false);
    const [analysis, setAnalysis] = React.useState<AdvisorResults>({} as AdvisorResults);
    const [recommendationLoading, setRecommendationLoading] = React.useState<boolean>(false);
    const [disableSubmit, setDisableSubmit] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [recommendation, setRecommendation] = React.useState<string | null | undefined>(null);
    const [displayRecommendation, setDisplayRecommendation] = React.useState<boolean>(false);

    const validateFields = (): boolean => {
        if (opponentName === ""){
            setError("Opponent name cannot be empty");
            return false;
        }
        if (maxDaysBack === ""){
            setError("Max days back cannot be empty");
            return false;
        }
        const maxDaysBackNum = parseInt(maxDaysBack);
        if (isNaN(maxDaysBackNum)){
            setError("Max days back must be a number");
            return false;
        }
        if (maxDaysBackNum < 0){
            setError("Max days back must be at least 1");
            return false;
        }
        if (maxDaysBackNum > 30){
            setError("Max days back cannot be greater than 30");
            return false;
        }
        return true;
    };

    const getAnalysisGuid = async (): Promise<string | undefined> => {
        const analysisParams: AnalysisParams = {
            targetName: opponentName,
            targetTwitterHandle: twitterHandle,
            maxDays: parseInt(maxDaysBack),
            resultsTitle: analysisTitle,
            additionalUserRequests: additionalUserRequests,
        };
        return ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CampaignAdvisor.Base + config.ControllerUrls.CampaignAdvisor.Analyze +
            props.campaignGuid,
            analysisParams
        ).then((response) => {
            return response.data.resultsGuid;
        }).catch((err) => {
            setError(err.response.data);
            return undefined;
        });
    };

    const getRecommendation = async (analysisGuid: string): Promise<string> => {
        return ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.CampaignAdvisor.Base + config.ControllerUrls.CampaignAdvisor.GenerateGptResponse +
            props.campaignGuid + "/" + analysisGuid,
            null
        ).then((response) => {
            return response.data.response;
        }).catch((err) => {
            setError(err.response.data);
            return "";
        });
    };

    const getAnalysis = async (analysisGuid: string): Promise<void> => {
        return ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CampaignAdvisor.Base
            + config.ControllerUrls.CampaignAdvisor.GetSpecificResultDetails + props.campaignGuid + "/" +
            analysisGuid
        ).then((response) => {
            setAnalysis(response.data);
        }).catch((err) => {
            setError(err.response.data);
        });
    };


    const submitAnalysis = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validateFields()){
            return;
        }
        setDisableSubmit(true);
        setLockFields(true);
        setAnalysisLoading(true);
        const analysisGuid = await getAnalysisGuid();
        if (analysisGuid === undefined){
            setAnalysisLoading(false);
            setDisableSubmit(false);
            return;
        }
        await getAnalysis(analysisGuid);
        setAnalysisLoading(false);
        setDisplayRecommendation(true);
        setRecommendationLoading(true);
        const rec = await getRecommendation(analysisGuid);
        setRecommendation(rec);
        setRecommendationLoading(false);
        Events.dispatch(Events.EventNames.ShouldRefreshPreviousAnalysisList);
    };

    return (
        <Stack direction={"column"} spacing={3}>
            <Form onSubmit={submitAnalysis}>
                <Stack direction={"column"} spacing={1}>
                    <p>
                        By providing the information specified below, we can analyze
                        your opponent&#39;s campaign and provide you
                        with a recommendation on how to improve your own campaign to better compete with your opponent.
                    </p>
                    <TabTextField fieldLabel={FieldNames.OpponentName} isReadOnly={lockFields}
                        isRequired={true} fieldText={opponentName} setFieldText={setOpponentName}/>
                    <Stack direction={"row"} spacing={3}>
                        <TabTextField fieldLabel={FieldNames.TwitterHandle} isReadOnly={lockFields}
                            isRequired={false} fieldText={twitterHandle} setFieldText={setTwitterHandle}/>
                        <Tooltip title={"By providing your opponent's twitter handle," +
                            " we can provide a much more accurate" +
                            " analysis of their social media activity"}>
                            <IconButton size={"small"}>
                                <InfoIcon color={"primary"} sx={{
                                    fontSize: "1rem",
                                }}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack direction={"row"} spacing={3}>
                        <TabTextField fieldLabel={FieldNames.MaxDaysBack} isReadOnly={lockFields}
                            isRequired={true} fieldText={maxDaysBack} setFieldText={setMaxDaysBack}
                            inputType={"number"}/>
                        <Tooltip title={"How many days back in the opponent's twitter history to look through," +
                            " at most. 30 days max."}>
                            <IconButton size={"small"}>
                                <InfoIcon color={"primary"} sx={{
                                    fontSize: "1rem",
                                }}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack direction={"row"} spacing={3}>
                        <TabTextField fieldLabel={FieldNames.Title} isReadOnly={lockFields}
                            isRequired={false} fieldText={analysisTitle} setFieldText={setAnalysisTitle}/>
                        <Tooltip title={"Fill this field to give a custom title to the analysis, to easily find it " +
                            "later. Leave it empty to use the default option of opponent name + analysis date."}>
                            <IconButton size={"small"}>
                                <InfoIcon color={"primary"} sx={{
                                    fontSize: "1rem",
                                }}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack direction={"row"} spacing={3}>
                        <TabTextField fieldLabel={FieldNames.AdditionalRequests} isReadOnly={lockFields}
                            isRequired={false} fieldText={additionalUserRequests}
                            setFieldText={setAdditionalUserRequests} isMultiline={true} maxLength={300}
                        />
                        <Tooltip title={"Any additional request you have for the generated recommendation." +
                            " Please note" +
                            " that requests that break the terms of service will be ignored."}>
                            <IconButton size={"small"}>
                                <InfoIcon color={"primary"} sx={{
                                    fontSize: "1rem",
                                }}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {!disableSubmit &&
                        <Stack direction={"column"} spacing={2} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "1rem",
                        }}>
                            <Button type={"submit"}>Analyze</Button>
                            {error !== "" &&
                                <Alert severity={"error"}>{error}</Alert>
                            }
                        </Stack>
                    }
                    {disableSubmit &&
                        <Box sx={{
                            paddingBottom: "1rem",
                        }}>
                            <ResultsDisplay permission={props.permission} campaignGuid={props.campaignGuid}
                                selectedAnalysis={analysis} setRecommendation={setRecommendation}
                                recommendation={recommendation}
                                displayRecommendation={displayRecommendation} firstFetchMade={true}
                                recommendationLoading={recommendationLoading}
                                analysisLoading={analysisLoading}
                            />
                        </Box>
                    }
                </Stack>
            </Form>
        </Stack>
    );
}

export default NewAnalysisTab;
