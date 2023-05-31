import React, {useState} from "react";
import SubPageWithPermissionBaseProps from "../../utils/sub-page-with-permission-base-props";
import {Box, Tab, Tabs} from "@mui/material";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import { PermissionTypes } from "../../../models/permission";
import TabPanel from "../../utils/TabPanel";
import NewAnalysisTab from "./campaignAdvisorTabs/NewAnalysisTab";
import PreviousAnalysisResultsTab from "./campaignAdvisorTabs/PreviousAnalysisResultsTab";

function CampaignAdvisorPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const renderMainSection = () => {
        if (props.permission.permissionType === PermissionTypes.Edit){
            return (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="New analysis" />
                            <Tab label="View past results" />
                        </Tabs>
                    </Box>
                    <TabPanel value={activeTab} index={0}>
                        <NewAnalysisTab/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <PreviousAnalysisResultsTab/>
                    </TabPanel>
                </>
            );
        }

        return (
            <PreviousAnalysisResultsTab/>
        );
    };

    return (
        <Box sx={{width: "100%", height: `calc(100% - ${Constants.topMenuHeight}px)`}}>
            {renderMainSection()}
        </Box>
    );
}

export default CampaignAdvisorPage;
