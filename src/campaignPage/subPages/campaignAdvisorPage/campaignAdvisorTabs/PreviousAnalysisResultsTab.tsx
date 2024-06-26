import React from "react";
import AnalysisOverview from "../../../../models/analysis-overview";
import {Accordion, AccordionSummary, Stack, Typography} from "@mui/material";
import SelectAnalysis from "./tabComponents/SelectAnalysis";
import TabTextField from "./tabComponents/TabTextField";
import AdvisorResults from "../../../../models/advisor-results";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import FieldNames from "./field-names";
import {toDdMmYyyy} from "../../../../utils/helperMethods/date-converter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Unstable_Grid2";
import Permission from "../../../../models/permission";
import ResultsDisplay from "./tabComponents/ResultsDisplay";


interface PreviousAnalysisResultsTabProps {
    previousAnalyses: AnalysisOverview[];
    campaignGuid: string;
    permission: Permission;
}
function PreviousAnalysisResultsTab(props: PreviousAnalysisResultsTabProps): JSX.Element {

    const [selectedOption, setSelectedOption] = React.useState<string>("");
    const [selectedAnalysis, setSelectedAnalysis] = React.useState<AdvisorResults>({} as AdvisorResults);
    const [overviewOpen, setOverviewOpen] = React.useState<boolean>(true);
    const [recommendation, setRecommendation] = React.useState<string | null | undefined>("");
    const [firstFetchMade, setFirstFetchMade] = React.useState<boolean>(false);

    const fetchSelectedAnalysis = (selected: string): void => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CampaignAdvisor.Base
            + config.ControllerUrls.CampaignAdvisor.GetSpecificResultDetails + props.campaignGuid
            + "/" + selected,
        ).then((response) => {
            setSelectedAnalysis(response.data);
            setOverviewOpen(true);
            setRecommendation(response.data.overview.gptResponse);
            setFirstFetchMade(true);
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
                        <TabTextField fieldText={selectedAnalysis.overview?.resultsTitle !== ""
                            ? selectedAnalysis.overview?.resultsTitle : "N/A"}
                        fieldLabel={FieldNames.Title} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.analysisTarget}
                            fieldLabel={FieldNames.OpponentName} isReadOnly={true}/>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <TabTextField fieldText={selectedAnalysis.overview?.targetTwitterHandle !== ""
                            ? selectedAnalysis.overview?.targetTwitterHandle : "N/A"}
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
                        <TabTextField fieldText={selectedAnalysis.overview?.additionalUserRequests !== ""
                            ? selectedAnalysis.overview?.additionalUserRequests : "N/A" }
                        fieldLabel={FieldNames.AdditionalRequests} isReadOnly={true} isMultiline={true}/>
                    </Grid>
                </Grid>
            </Accordion>
            <ResultsDisplay permission={props.permission} campaignGuid={props.campaignGuid}
                selectedAnalysis={selectedAnalysis} setRecommendation={setRecommendation}
                displayRecommendation={true} firstFetchMade={firstFetchMade}
                recommendationLoading={false} analysisLoading={false}
                recommendation={recommendation}
            />
        </Stack>
    );
}

export default PreviousAnalysisResultsTab;
