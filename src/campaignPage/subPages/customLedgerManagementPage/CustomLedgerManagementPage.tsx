import React, {useEffect, useState} from "react";
import SubPageWithPermissionBaseProps from "../../utils/sub-page-with-permission-base-props";
import {useParams} from "react-router-dom";
import ManageExistingLedgersTab from "./customLedgerManagementPageTabs/ManageExistingLedgersTab";
import UploadNewLedgerTab from "./customLedgerManagementPageTabs/UploadNewLedgerTab";
import {Box, Tab, Tabs} from "@mui/material";
import CustomVotersLedger from "../../../models/custom-voters-ledger";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import TabPanel from "../../utils/TabPanel";
import Events from "../../../utils/helperMethods/events";

function CustomLedgerManagementPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const [activeTab, setActiveTab] = useState(0);
    const [customLedgers, setCustomLedgers] = useState<CustomVotersLedger[]>([]);

    /**
     * Gets the custom ledgers from the server and sets the customLedgers state to the response.
     */
    const getLedgers = () => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CustomVotersLedger.Base +
            config.ControllerUrls.CustomVotersLedger.GetForCampaign + campaignGuid
        ).then((response) => {
            setCustomLedgers(response.data);
        });
    };

    // Logic for getting custom ledgers from the server - runs once on component mount.
    // Gets the ledgers on load, and whenever the RefreshCustomLedgers event is fired by one of the tabs.
    useEffect(() => {
        getLedgers();
        Events.subscribe(Events.EventNames.RefreshCustomLedgers, getLedgers);
        return () => {
            Events.unsubscribe(Events.EventNames.RefreshCustomLedgers, getLedgers);
        };
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };


    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Manage existing ledgers" />
                    <Tab label="Create / upload ledger" />
                </Tabs>
            </Box>
            <TabPanel value={activeTab} index={0}>
                <ManageExistingLedgersTab campaignGuid={campaignGuid as string} customLedgers={customLedgers}/>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <UploadNewLedgerTab campaignGuid={campaignGuid as string} customLedgers={customLedgers}/>
            </TabPanel>
        </Box>
    );
}

export default CustomLedgerManagementPage;
