/**
* A model for a single row of the voters ledger table.<br/>
* The fields are named according to the names of the columns in the table.<br/>
* The spare fields are because they can be provided by the official voters ledger, but are generally not used, so it
* is easier to ignore them (this line has been written because
 * I tried figuring out what the spare fields are for way too long,
* so I would like to save the next person the trouble).
*/
interface VotersLedgerRecord
{
    idNum: number;
    firstName: string | null;
    lastName: string | null;
    fathersName: string | null;
    cityId: number | null;
    ballotId: number | null;
    spare1: string | null;
    residenceId: number | null;
    residenceName: string | null;
    spare2: string | null;
    streetId: number | null;
    streetName: string | null;
    houseNumber: number | null;
    entrance: string | null;
    appartment: number | null;
    houseLetter: string | null;
    ballotSerial: number | null;
    spare3: string | null;
    spare4: string | null;
    zipCode: number | null;
    spare5: string | null;
    campaignYear: number | null;
}

export default VotersLedgerRecord;
