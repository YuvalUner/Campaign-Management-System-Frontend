import {Guid} from "guid-typescript";

interface Campaign {
    campaignName?: string;
    campaignDescription?: string;
    campaignGuid?: string | Guid;
    campaignCreationDate?: Date;
    campaignIsActive?: boolean;
    isSubCampaign?: boolean;
    cityName?: string;
    campaignLogoUrl?: string;
    isMunicipal?: boolean;
}

export default Campaign;
