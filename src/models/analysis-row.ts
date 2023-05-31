// eslint-disable-next-line no-shadow
export enum RowTypes
{
    Article = 0,
    TweetFromTarget = 1,
    TweetAboutTarget = 2,
}

interface AnalysisRow
{
    resultsGuid: string | null;
    topic: string | null;
    total: number | null;
    positive: number | null;
    negative: number | null;
    neutral: number | null;
    hate: number | null;
    rowType: RowTypes | null;
}
export default AnalysisRow;
