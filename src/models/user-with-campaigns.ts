import User from "./user";
import Campaign from "./campaign";

interface UserWithCampaigns {
    user: User;
    campaigns: Campaign[] | null;
}

export default UserWithCampaigns;
