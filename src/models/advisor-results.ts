import AnalysisOverview from "./analysis-overview";
import AnalysisRow from "./analysis-row";
import AnalysisSample from "./analysis-sample";

interface AdvisorResults
{
    overview: AnalysisOverview | null;
    details: AnalysisRow[];
    samples: AnalysisSample[];
}
export default AdvisorResults;
