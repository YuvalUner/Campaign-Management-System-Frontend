import React, {useCallback, useState} from "react";
import FinancialType from "../../../models/financialType";
import FinancialData from "../../../models/financialData";
import {IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import IncomeIcon from "@mui/icons-material/CallReceived";
import ExpenseIcon from "@mui/icons-material/CallMade";
import DeleteIcon from "@mui/icons-material/Delete";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Sync";
import {UpdateTransactionDialog} from "./UpdateTransactionDialog";

interface TransactionsPageProps {
    transactionTypes: FinancialType[] | null;
    transactions: FinancialData[] | null;
    fetchTransaction: () => Promise<void>;
}

export const TransactionsPage = (props: TransactionsPageProps) => {
    // .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [updateTransactionDialogData, setUpdateTransactionDialogData] = useState<FinancialData | null>(null);

    const closeUpdateDialog = () => {
        setUpdateTransactionDialogData(null);
    };

    const openUpdateDialog = (transaction: FinancialData) => {
        setUpdateTransactionDialogData(transaction);
    };


    const onDeleteIconClick = useCallback(async (transactionGuid: string) => {
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.FinancialData.Base + config.ControllerUrls.FinancialData.DeleteFinancialData + `${campaignGuid}/${transactionGuid}`,
        );
        await props.fetchTransaction();
    }, [campaignGuid]);


    return (
        <>
        {updateTransactionDialogData !== null &&
                <UpdateTransactionDialog transaction={updateTransactionDialogData} closeDialog={closeUpdateDialog}
                                         transactionTypes={props.transactionTypes} fetch={props.fetchTransaction}/>}
            <Typography variant="h5">
                Transactions
            </Typography>
            <List>
                {props.transactions?.map((transaction) =>
                    <ListItem key={transaction.dataGuid} secondaryAction={
                        <Stack direction="row" spacing={2}>
                            <IconButton aria-label="delete"
                                        onClick={() => onDeleteIconClick(transaction.dataGuid)}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton aria-label="update"
                                        onClick={() => openUpdateDialog(transaction)}>
                                <UpdateIcon/>
                            </IconButton>
                        </Stack>
                    }>
                        <ListItemIcon>
                            {transaction.isExpense
                                ? <ExpenseIcon color="warning"/>
                                : <IncomeIcon color="success"/>}
                        </ListItemIcon>
                        <ListItemText
                            primary={`${transaction.dataTitle} (${transaction.amount}$)`}
                            secondary={`created on ${new Date(transaction.dateCreated).toLocaleString()} By ${transaction.displayNameEng} of type ${transaction.typeName}`}
                        />
                    </ListItem>,
                )}
            </List>
        </>
    );
};