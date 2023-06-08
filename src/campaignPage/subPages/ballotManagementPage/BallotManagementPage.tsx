import React, {useEffect} from "react";
import SubPageWithPermissionBaseProps from "../../utils/sub-page-with-permission-base-props";
import {Box, Tab, Tabs} from "@mui/material";
import TabPanel from "../../utils/TabPanel";
import ManageBallotsTab from "./ballotManagementTabs/ManageBallotsTab";
import ManagePartiesTab from "./ballotManagementTabs/ManagePartiesTab";
import {useParams} from "react-router-dom";
import Party from "../../../models/party";
import Ballot from "../../../models/ballot";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";

interface BallotManagementPageProps extends SubPageWithPermissionBaseProps {
    isCustomCampaign: boolean;
}

function BallotManagementPage(props: BallotManagementPageProps): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [activeTab, setActiveTab] = React.useState(0);
    const [parties, setParties] = React.useState<Party[]>([]);
    const [ballots, setBallots] = React.useState<Ballot[]>([]);

    const getParties = () => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Parties.Base + config.ControllerUrls.Parties.GetAllParties + campaignGuid,
        ).then((response) => {
            setParties(response.data);
        });
    };

    const getBallots = () => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Ballots.Base + config.ControllerUrls.Ballots.GetAllBallots + campaignGuid,
        ).then((response) => {
            setBallots(response.data);
        });
    };

    useEffect(() => {
        getParties();
        getBallots();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Manage ballots"/>
                    <Tab label="Manage parties"/>
                </Tabs>
                <TabPanel index={0} value={activeTab}>
                    <ManageBallotsTab permission={props.permission} ballots={ballots}
                        updateBallots={setBallots} isCustomCampaign={props.isCustomCampaign}/>
                </TabPanel>
                <TabPanel index={1} value={activeTab}>
                    <ManagePartiesTab permission={props.permission} parties={parties} updateParties={setParties}/>
                </TabPanel>
            </Box>
        </Box>
    );
}

export default BallotManagementPage;
