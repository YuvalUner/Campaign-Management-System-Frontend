import React, {useEffect, useState} from "react";
import SubPageWithPermissionBaseProps from "../../utils/sub-page-with-permission-base-props";
import {Box, Tab, Tabs} from "@mui/material";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import { PermissionTypes } from "../../../models/permission";
import TabPanel from "../../utils/TabPanel";
import NewAnalysisTab from "./campaignAdvisorTabs/NewAnalysisTab";
import PreviousAnalysisResultsTab from "./campaignAdvisorTabs/PreviousAnalysisResultsTab";
import AnalysisOverview from "../../../models/analysis-overview";
import config from "../../../app-config.json";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import {useParams} from "react-router-dom";
import Events from "../../../utils/helperMethods/events";

function CampaignAdvisorPage(props: SubPageWithPermissionBaseProps): JSX.Element {

    const params = useParams();
    const campaignGuid = params.campaignGuid;
    const [activeTab, setActiveTab] = useState(0);
    const [previousAnalyses, setPreviousAnalyses] = useState<AnalysisOverview[]>([]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const fetchPreviousAnalyses = () => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CampaignAdvisor.Base + config.ControllerUrls.CampaignAdvisor.GetAllResults
            + campaignGuid,
        ).then((response) => {
            setPreviousAnalyses(response.data);
        });
    };

    useEffect(() => {
        fetchPreviousAnalyses();
        Events.subscribe(Events.EventNames.ShouldRefreshPreviousAnalysisList, fetchPreviousAnalyses);
        return () => {
            Events.unsubscribe(Events.EventNames.ShouldRefreshPreviousAnalysisList, fetchPreviousAnalyses);
        };
    }, []);

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
                        <NewAnalysisTab campaignGuid={campaignGuid as string} permission={props.permission}/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <PreviousAnalysisResultsTab previousAnalyses={previousAnalyses}
                            campaignGuid={campaignGuid as string} permission={props.permission}/>
                    </TabPanel>
                </>
            );
        }

        return (
            <PreviousAnalysisResultsTab previousAnalyses={previousAnalyses} campaignGuid={campaignGuid as string}
                permission={props.permission}
            />
        );
    };

    return (
        <Box sx={{width: "100%", height: `calc(100% - ${Constants.topMenuHeight}px)`}}>
            {renderMainSection()}
        </Box>
    );
}

export default CampaignAdvisorPage;
