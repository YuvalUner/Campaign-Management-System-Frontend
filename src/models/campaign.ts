import {Guid} from "guid-typescript";

interface Campaign {
    campaignName: string | null;
    campaignDescription: string | null;
    campaignGuid: Guid | null;
    campaignCreationDate: Date | null;
    campaignIsActive: boolean | null;
    isSubCampaign: boolean | null;
    cityName: string | null;
    campaignLogoUrl: string | null;
}

export default Campaign;
