import React from "react";
import {Accordion, AccordionSummary, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import SamplesList from "./SamplesList";
import RecommendationDisplay from "./RecommendationDisplay";
import Permission from "../../../../../models/permission";
import AdvisorResults from "../../../../../models/advisor-results";
import {Spinner} from "react-bootstrap";
import AnalysisDetailsSection from "./AnalysisDetailsSection";
import {RowTypes} from "../../../../../models/analysis-row";

interface ResultsDisplayProps {
    permission: Permission;
    campaignGuid: string;
    selectedAnalysis: AdvisorResults;
    recommendation?: string | null;
    setRecommendation: (recommendation: string | null | undefined) => void;
    displayRecommendation: boolean;
    firstFetchMade: boolean;
    recommendationLoading: boolean;
    analysisLoading: boolean;
}

function ResultsDisplay(props: ResultsDisplayProps): JSX.Element {

    const renderRecommendation = (): JSX.Element => {
        if (props.recommendationLoading){
            return (
                <Stack direction={"column"} spacing={2} alignItems={"center"} justifyContent={"center"} sx={{
                    marginTop: "2rem",
                }}>
                    <Spinner/>
                    <Typography variant={"h6"}>Generating recommendation
                        - please be patient, this may take some time</Typography>
                </Stack>
            );
        }
        return (
            <Accordion sx={{
                paddingBottom: "1rem"
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Stack direction={"row"} spacing={1}>
                        <Typography variant={"h6"}>Recommendation</Typography>
                        <Tooltip title={"Recommendations are generated using the analysis and ChatGPT"}>
                            <IconButton size={"small"}>
                                <InfoIcon sx={{
                                    fontSize: "1rem",
                                }} color={"primary"}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </AccordionSummary>
                {props.recommendation !== undefined &&
                    <RecommendationDisplay permission={props.permission}
                        resultsGuid={props.selectedAnalysis.overview?.resultsGuid as string}
                        recommendation={props.recommendation}
                        campaignGuid={props.campaignGuid}
                        setRecommendation={props.setRecommendation}
                        firstFetchMade={props.firstFetchMade}
                    />
                }
            </Accordion>
        );
    };

    const renderDetails = (): JSX.Element => {
        if (props.analysisLoading){
            return (
                <Stack direction={"column"} spacing={2} alignItems={"center"} justifyContent={"center"} sx={{
                    marginTop: "2rem",
                }}>
                    <Spinner/>
                    <Typography variant={"h6"}>Analyzing opponent&#39;s campaign
                        - please be patient, this can take a couple of minutes</Typography>
                </Stack>
            );
        }
        return (
            <Stack direction={"column"} spacing={3}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography variant={"h6"}>Details</Typography>
                    </AccordionSummary>
                    {props.selectedAnalysis.details !== undefined && <>
                        <AnalysisDetailsSection analysisDetails={props.selectedAnalysis.details?.filter(x => x.rowType
                            === RowTypes.Article)} analysisType={"Articles"}/>
                        <AnalysisDetailsSection analysisDetails={props.selectedAnalysis.details?.filter(x => x.rowType
                            === RowTypes.TweetFromTarget)} analysisType={"Tweets from opponent"}/>
                        <AnalysisDetailsSection analysisDetails={props.selectedAnalysis.details?.filter(x => x.rowType
                            === RowTypes.TweetAboutTarget)} analysisType={"Tweets about opponent"}
                        tooltipText={"This analysis is much less accurate than the other two," +
                                                    " as it was based on looking for" +
                                                    "the opponent's name on twitter. As such, please" +
                                                    " take the results with a" +
                                                    " grain of salt." +
                                                    " They also have the least impact on the below recommendation."}
                        />
                    </>}
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Stack direction={"row"} spacing={1}>
                            <Typography variant={"h6"}>Samples</Typography>
                            <Tooltip title={"Up to 10 articles and tweets from the opponent are saved for" +
                                " display here," +
                                "and are also used when generating the recommendation."}>
                                <IconButton size={"small"}>
                                    <InfoIcon sx={{
                                        fontSize: "1rem",
                                    }} color={"primary"}/>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </AccordionSummary>
                    {props.selectedAnalysis.samples !== undefined && <>
                        <SamplesList samplesType={"Articles"}
                            samples={props.selectedAnalysis.samples?.filter(x => x.isArticle === true)}/>
                        <SamplesList samplesType={"Opponent tweets"}
                            samples={props.selectedAnalysis.samples?.filter(x => x.isArticle === false)}/>
                    </>}
                </Accordion>
            </Stack>
        );
    };

    return (
        <Stack direction={"column"} spacing={3}>
            {renderDetails()}
            {props.displayRecommendation && renderRecommendation()}
        </Stack>
    );
}

export default ResultsDisplay;
