import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import FinancialType from "../../../models/financialType";
import {FinancialSummary} from "../../../models/financialSummary";
import FinancialData from "../../../models/financialData";
import {TransactionsTab} from "../FinancialPage/TransactionTab/TransactionTab";
import {Box, Tab, Tabs} from "@mui/material";
import GraphIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import AddIcon from "@mui/icons-material/Add";
import TabPanel from "../../utils/TabPanel";
import {GraphPage} from "./GraphPage";
import {TransactionTypeTab} from "../FinancialPage/TransactionTypesTab/TransactionTypesTab";
import FilterListIcon from '@mui/icons-material/FilterList';

interface FinancialPageProps {
    campaign: Campaign | null;
}

const FinancialPage = (props: FinancialPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [transactionsTypes, setTransactionsTypes] = useState<FinancialType[] | null>(null);
    const [transactions, setTransactions] = useState<FinancialData[] | null>(null);
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const [currentTab, setCurrentTab] = useState(0);


    const getTransactionsTypes = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.FinancialTypes.Base + config.ControllerUrls.FinancialTypes.GetFinancialTypesForCampaign + campaignGuid,
        );
        let types = res.data as FinancialType[];
        const objIndex = types.findIndex((obj) => obj.typeName === "Other");
        types[objIndex].typeDescription = "";
        types.sort((a, b)=>a.typeName.localeCompare(b.typeName));
        setTransactionsTypes(res.data);
        console.dir("getTransactionsTypes");
        console.dir(res.data);
    };

    const getTransactions = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.FinancialData.Base + config.ControllerUrls.FinancialData.GetFinancialDataForCampaign + campaignGuid,
        );
        setTransactions(res.data);
        console.dir("getTransactions");
        console.dir(res.data);
    };

    const getSummary = async () => {
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.FinancialData.Base + config.ControllerUrls.FinancialData.GetFinancialDataSummaryForCampaign + campaignGuid,
            {},
        );
        let summary = res.data as FinancialSummary;
        summary.balances.forEach((value, index) => {
            value.x = index + 1;
        });
        setSummary(res.data);
        console.dir("getSummary");
        console.dir(res.data);
    };

    useEffect(() => {
        getTransactionsTypes();
        getTransactions();
        getSummary();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <>
            <Box sx={{width: "100%", height: `calc(100% - ${Constants.topMenuHeight}px)`}}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab icon={<ListIcon/>} label="Transactions" value={0}/>
                        <Tab icon={<FilterListIcon/>} label="Transaction Types" value={2}/>
                        <Tab icon={<GraphIcon/>} label="Balance" value={1}/>
                    </Tabs>
                </Box>
                <TabPanel value={currentTab} index={0}>
                    <TransactionsTab transactionTypes={transactionsTypes} transactions={transactions}
                                     fetchTransaction={getTransactions}/>
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                    <GraphPage transactionTypes={transactionsTypes} transactions={summary}/>
                </TabPanel>
                <TabPanel value={currentTab} index={2}>
                    <TransactionTypeTab transactionTypes={transactionsTypes}
                                        fetchTransactions={getTransactions}
                                        fetchTransactionsTypes={getTransactionsTypes}/>
                </TabPanel>
            </Box>
        </>
    );
};

export default FinancialPage;