interface AnalysisOverview
{
    resultsGuid: string | null;
    timePerformed: Date | null;
    resultsTitle: string | null;
    analysisTarget: string | null;
    targetTwitterHandle: string | null;
    maxDaysBack: number | null;
    gptResponse: string | null;
    additionalUserRequests: string | null;
}
export default AnalysisOverview;
