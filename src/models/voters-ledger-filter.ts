/**
* A model used for filtering the voters ledger table.<br/>
* All parameters but CampaignGuid are optional, and if a parameter is null, it will not be used for filtering.
*/
interface VotersLedgerFilter
{
    campaignGuid: string | null;
    idNum: number | null;
    firstName: string | null;
    lastName: string | null;
    ballotId: number | null;
    cityName: string | null;
    streetName: string | null;
    supportStatus: boolean | null;
}

export default VotersLedgerFilter;
