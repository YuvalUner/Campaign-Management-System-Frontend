import React, {useState} from "react";
import FinancialType from "../../../../models/financialType";
import FinancialData from "../../../../models/financialData";
import {IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import IncomeIcon from "@mui/icons-material/CallReceived";
import ExpenseIcon from "@mui/icons-material/CallMade";
import DeleteIcon from "@mui/icons-material/Delete";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {useParams} from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Sync";
import AddTransactionDialog from "./AddTransactionDialog";
import {Button} from "react-bootstrap";
import {UpdateTransactionDialog} from "./UpdateTransactionDialog";
import AddIcon from "@mui/icons-material/Add";
import {DeleteDialog} from "../DeleteDialog";

interface TransactionsTabProps {
    transactionTypes: FinancialType[] | null;
    transactions: FinancialData[] | null;
    fetchTransaction: () => Promise<void>;
}

export const TransactionsTab = (props: TransactionsTabProps) => {
    // .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [updateDialogData, setUpdateDialogData] = useState<FinancialData | null>(null);
    const [deleteDialogData, setDeleteDialogData] = useState<string | null>(null);

    const switchAddTransactionMode = () => {
        setIsAddDialogOpen((prev) => !prev);
    };

    const openUpdateDialog = (transaction: FinancialData) => {
        setUpdateDialogData(transaction);
    };
    const closeUpdateDialog = () => {
        setUpdateDialogData(null);
    };

    const openDeleteDialog = (transactionGuid: string) => {
        setDeleteDialogData(transactionGuid);
    };
    const closeDeleteDialog = () => {
        setDeleteDialogData(null);
    };


    const onDeleteIconClick = async (transactionGuid: string) => {
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.FinancialData.Base + config.ControllerUrls.FinancialData.DeleteFinancialData + `${campaignGuid}/${transactionGuid}`,
        );
        await props.fetchTransaction();
    };


    return (
        <>
            {updateDialogData !== null &&
                <UpdateTransactionDialog transaction={updateDialogData} closeDialog={closeUpdateDialog}
                                         transactionTypes={props.transactionTypes} fetch={props.fetchTransaction}/>}
            <AddTransactionDialog isOpen={isAddDialogOpen} switchMode={switchAddTransactionMode}
                                  transactionTypes={props.transactionTypes}
                                  fetch={props.fetchTransaction}/>
            <DeleteDialog values={deleteDialogData} switchMode={closeDeleteDialog} action={onDeleteIconClick}/>

            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    Transactions
                </Typography>
                <Button onClick={switchAddTransactionMode}>Add Transaction <AddIcon/></Button>
            </Stack>
            <List>
                {props.transactions?.map((transaction) =>
                    <ListItem key={transaction.dataGuid} secondaryAction={
                        <Stack direction="row" spacing={2}>
                            <IconButton aria-label="delete"
                                        onClick={() => openDeleteDialog(transaction.dataGuid)}>
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