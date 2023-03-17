import User from "./user";
import CampaignWithRole from "./campaign-with-role";

interface UserWithCampaigns {
    user: User;
    campaigns: CampaignWithRole[] | null;
}

export default UserWithCampaigns;
