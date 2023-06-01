import React from "react";
import AnalysisOverview from "../../../../models/analysis-overview";
import {Accordion, AccordionSummary, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import SelectAnalysis from "./tabComponents/SelectAnalysis";
import TabTextField from "./tabComponents/TabTextField";
import AdvisorResults from "../../../../models/advisor-results";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import FieldNames from "./field-names";
import {toDdMmYyyy} from "../../../../utils/helperMethods/date-converter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Unstable_Grid2";
import AnalysisDetailsSection from "./tabComponents/AnalysisDetailsSection";
import {RowTypes} from "../../../../models/analysis-row";
import InfoIcon from "@mui/icons-material/Info";


interface PreviousAnalysisResultsTabProps {
    previousAnalyses: AnalysisOverview[];
    campaignGuid: string;
}
function PreviousAnalysisResultsTab(props: PreviousAnalysisResultsTabProps): JSX.Element {

    const [selectedOption, setSelectedOption] = React.useState<string>("");
    const [selectedAnalysis, setSelectedAnalysis] = React.useState<AdvisorResults>({} as AdvisorResults);
    const [overviewOpen, setOverviewOpen] = React.useState<boolean>(true);

    const fetchSelectedAnalysis = (selected: string): void => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CampaignAdvisor.Base
            + config.ControllerUrls.CampaignAdvisor.GetSpecificResultDetails + props.campaignGuid
            + "/" + selected,
        ).then((response) => {
            setSelectedAnalysis(response.data);
            setOverviewOpen(true);
        });
    };

    const onChangeOverviewOpen = (event: React.SyntheticEvent, expanded: boolean) => {
        setOverviewOpen(expanded);
    };

    return (
        <Stack direction={"column"} spacing={3}>
            <SelectAnalysis previousAnalyses={props.previousAnalyses} selectedOption={selectedOption}
                setSelectedOption={setSelectedOption} fetchSelected={fetchSelectedAnalysis}/>
            <Accordion expanded={overviewOpen} onChange={onChangeOverviewOpen}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant={"h6"}>Overview</Typography>
                </AccordionSummary>
                <Grid container spacing={3} sx={{
                    padding: "1rem",
                }}>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.resultsTitle}
                            fieldLabel={FieldNames.Title} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.analysisTarget}
                            fieldLabel={FieldNames.OpponentName} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.targetTwitterHandle}
                            fieldLabel={FieldNames.TwitterHandle} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={toDdMmYyyy(selectedAnalysis.overview?.timePerformed as Date)}
                            fieldLabel={FieldNames.DatePerformed} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.maxDaysBack?.toString()}
                            fieldLabel={FieldNames.MaxDaysBack} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.additionalUserRequests}
                            fieldLabel={FieldNames.AdditionalRequests} isReadOnly={true} isMultiline={true}/>
                    </Grid>
                </Grid>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant={"h6"}>Details</Typography>
                </AccordionSummary>
                <AnalysisDetailsSection analysisDetails={selectedAnalysis.details?.filter(x => x.rowType
                    === RowTypes.Article)} analysisType={"Articles"}/>
                <AnalysisDetailsSection analysisDetails={selectedAnalysis.details?.filter(x => x.rowType
                    === RowTypes.TweetFromTarget)} analysisType={"Tweets from opponent"}/>
                <AnalysisDetailsSection analysisDetails={selectedAnalysis.details?.filter(x => x.rowType
                    === RowTypes.TweetAboutTarget)} analysisType={"Tweets about opponent"}
                tooltipText={"This analysis is much less accurate than the other two, as it was based on looking for" +
                        "the opponent's name on twitter. As such, please take the results with a grain of salt." +
                        " They also have the least impact on the below recommendation."}
                />
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Stack direction={"row"} spacing={1}>
                        <Typography variant={"h6"}>Samples</Typography>
                        <Tooltip title={"Up to 10 articles and tweets from the opponent are saved for display here," +
                            "and are also used when generating the recommendation."}>
                            <IconButton size={"small"}>
                                <InfoIcon sx={{
                                    fontSize: "1rem",
                                }} color={"primary"}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </AccordionSummary>
            </Accordion>
        </Stack>
    );
}

export default PreviousAnalysisResultsTab;
