import VotersLedgerRecord from "./voters-ledger-record";

/**
 * Each instance of this class represents a single record from the voters ledger table, with the addition of the user's
 * phone number(s), email address(es), support status for a campaign, and the ballot assigned to them.
 */
interface VotersLedgerFilterRecord extends VotersLedgerRecord
{
    email1: string | null;
    email2: string | null;
    phone1: string | null;
    phone2: string | null;
    innerCityBallotId: number | null;
    ballotAddress: string | null;
    ballotLocation: string | null;
    accessible: boolean | null;
    elligibleVoters: number | null;
    supportStatus: boolean | null;
}
export default VotersLedgerFilterRecord;
