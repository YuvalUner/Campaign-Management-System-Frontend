import React, {useEffect, useState} from "react";
import Campaign from "../../../models/campaign";
import AddTransactionTypeDialog from "./AddTransactionTypeDialog";
import {Button} from "react-bootstrap";
import AddTransactionDialog from "./AddTransactionDialog";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import FinancialType from "../../../models/financialType";
import FinancialSummary from "../../../models/financialSummary";
import FinancialData from "../../../models/financialData";

interface FinancialPageProps {
    campaign: Campaign | null;
}

const FinancialPage = (props: FinancialPageProps): JSX.Element => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [isOpenAddTransactionType, setIsOpenAddTransactionType] = useState(false);
    const [isOpenAddTransaction, setIsOpenAddTransaction] = useState(false);
    const [transactionsTypes, setTransactionsTypes] = useState<FinancialType[] | null>(null);
    const [transactions, setTransactions] = useState<FinancialData[] | null>(null);
    const [summary, setSummary] = useState<FinancialSummary | null>(null);

    const switchAddTransactionTypeMode = () => {
        setIsOpenAddTransactionType((prev) => !prev);
    };

    const switchAddTransactionMode = () => {
        setIsOpenAddTransaction((prev) => !prev);
    };

    const getTransactionsTypes = async () => {
        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.FinancialTypes.Base + config.ControllerUrls.FinancialTypes.GetFinancialTypesForCampaign + campaignGuid,
        );
        const objIndex = (res.data as FinancialType[]).findIndex((obj) => obj.typeName === "Other");
        (res.data as FinancialType[])[objIndex].typeDescription = "";
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
        setSummary(res.data);
        console.dir("getSummary");
        console.dir(res.data);
    };

    useEffect(() => {
        getTransactionsTypes();
        getTransactions();
        getSummary();
    }, []);

    return (
        <>
            <AddTransactionTypeDialog isOpen={isOpenAddTransactionType} switchMode={switchAddTransactionTypeMode}
                                      fetch={getTransactionsTypes}/>
            <AddTransactionDialog isOpen={isOpenAddTransaction} switchMode={switchAddTransactionMode}
                                  transactionTypes={transactionsTypes}
                                  fetch={getTransactions}/>
            <Button onClick={switchAddTransactionTypeMode}>Add Type</Button>
            <Button onClick={switchAddTransactionMode}>Add Type</Button>
        </>
    );
};

export default FinancialPage;