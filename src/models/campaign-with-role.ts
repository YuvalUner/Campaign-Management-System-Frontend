import Campaign from "./campaign";

interface CampaignWithRole extends Campaign {
    roleName?: string;
}

export default CampaignWithRole;
