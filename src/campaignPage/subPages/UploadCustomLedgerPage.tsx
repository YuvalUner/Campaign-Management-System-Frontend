import React, {useState} from "react";
import SubPageWithPermissionBaseProps from "../utils/sub-page-with-permission-base-props";
import {useParams} from "react-router-dom";
import ManageExistingLedgersTab from "./uploadCustomVotersLedgerPageTabs/ManageExistingLedgersTab";
import UploadNewLedgerTab from "./uploadCustomVotersLedgerPageTabs/UploadNewLedgerTab";
import {Box, Tab, Tabs} from "@mui/material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function UploadCustomLedgerPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };


    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Manage existing ledgers" />
                    <Tab label="Create / upload ledger" />
                </Tabs>
            </Box>
            <TabPanel value={activeTab} index={0}>
                <ManageExistingLedgersTab campaignGuid={campaignGuid as string}/>
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <UploadNewLedgerTab campaignGuid={campaignGuid as string}/>
            </TabPanel>
        </Box>
    );
}

export default UploadCustomLedgerPage;
