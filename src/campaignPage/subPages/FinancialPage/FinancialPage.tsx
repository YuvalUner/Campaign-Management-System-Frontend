import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import FinancialType from "../../../models/financialType";
import {Balance2, FinancialSummary} from "../../../models/financialSummary";
import FinancialData from "../../../models/financialData";
import {TransactionsTab} from "./TransactionTab/TransactionTab";
import {Box, Stack, Tab, Tabs, Typography} from "@mui/material";
import GraphIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import Constants from "../../../utils/constantsAndStaticObjects/constants";
import TabPanel from "../../utils/TabPanel";
import {GraphTab} from "./GraphTab/GraphTab";
import {TransactionTypeTab} from "./TransactionTypesTab/TransactionTypesTab";
import FilterListIcon from "@mui/icons-material/FilterList";

interface FinancialPageProps {
    campaign: Campaign | null;
}

const FinancialPage = (props: FinancialPageProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [transactionsTypes, setTransactionsTypes] = useState<FinancialType[] | null>(null);
    const [transactions, setTransactions] = useState<FinancialData[] | null>(null);
    const [summary, setSummary] = useState<Balance2[] | null>(null);
    const [currentTab, setCurrentTab] = useState(0);


    const getTransactionsTypes = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.FinancialTypes.Base +
            config.ControllerUrls.FinancialTypes.GetFinancialTypesForCampaign +
            campaignGuid,
        );
        const types = res.data as FinancialType[];
        const objIndex = types.findIndex((obj) => obj.typeName === "Other");
        types[objIndex].typeDescription = "";
        types.sort((a, b) => a.typeName.localeCompare(b.typeName));
        setTransactionsTypes(types);
    };

    const getTransactions = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.FinancialData.Base +
            config.ControllerUrls.FinancialData.GetFinancialDataForCampaign +
            campaignGuid,
        );
        const transactions = res.data as FinancialData[];
        transactions.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));

        const summary = Array<Balance2>();
        let balance = 0;
        let expenses = 0;
        let income = 0;
        transactions.forEach((e) => {
            balance += e.isExpense ? -e.amount : e.amount;
            expenses += e.isExpense ? e.amount : 0;
            income += !e.isExpense ? e.amount : 0;
            summary.push({balance, expenses, income, date: new Date(e.dateCreated)});
        });
        transactions.reverse();
        setTransactions(transactions);
        setSummary(summary);
    };

    const getSummary = async () => {
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.FinancialData.Base +
            config.ControllerUrls.FinancialData.GetFinancialDataSummaryForCampaign +
            campaignGuid,
            {},
        );
        const summary = res.data as FinancialSummary;
        summary.balances.forEach((value, index) => {
            value.x = index + 1;
        });
        setSummary(res.data);
    };

    useEffect(() => {
        getTransactionsTypes();
        getTransactions();
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
                <Stack direction={"row"} sx={{width: "100%"}} justifyContent="space-evenly" alignItems="center">
                    <Typography variant={"h4"} color={"#de454a"}>
                        Expenses: {summary?.at(-1)?.expenses}
                    </Typography>
                    <Typography variant={"h4"} color={"#45de7d"}>
                        Income: {summary?.at(-1)?.income}
                    </Typography>
                    <Typography variant={"h4"} color={"#4594de"}>
                        Balance: {summary?.at(-1)?.balance}
                    </Typography>
                </Stack>
                <TabPanel value={currentTab} index={0}>
                    <TransactionsTab transactionTypes={transactionsTypes} transactions={transactions}
                        fetchTransaction={getTransactions}/>
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                    <GraphTab balances={summary}/>
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
