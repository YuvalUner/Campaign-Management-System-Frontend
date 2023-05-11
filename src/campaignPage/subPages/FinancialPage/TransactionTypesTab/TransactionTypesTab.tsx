import React, {useState} from "react";
import FinancialType from "../../../../models/financialType";
import {IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import ServerRequestMaker from "../../../../utils/helperMethods/server-request-maker";
import config from "../../../../app-config.json";
import {useParams} from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Sync";
import AddTransactionTypeDialog from "./AddTransactionTypeDialog";
import {Button} from "react-bootstrap";
import UpdateTransactionTypeDialog from "./UpdateTransactionTypeDialog";
import AddIcon from "@mui/icons-material/Add";
import {DeleteDialog} from "../DeleteDialog";

interface TransactionTypeTabProps {
    transactionTypes: FinancialType[] | null;
    fetchTransactions: () => Promise<void>;
    fetchTransactionsTypes: () => Promise<void>;
}

export const TransactionTypeTab = (props: TransactionTypeTabProps) => {
    // .sort((a, b) => a.dateCreated.localeCompare(b.dateCreated))
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteDialogData, setDeleteDialogData] = useState<string | null>(null);
    const [updateDialogData, setUpdateDialogData] = useState<FinancialType | null>(null);

    const switchAddTransactionTypeMode = () => {
        setIsAddDialogOpen((prev) => !prev);
    };

    const openDeleteDialog = (typeGuid:string) => {
        setDeleteDialogData(typeGuid);
    };
    const closeDeleteDialog = () => {
        setDeleteDialogData(null);
    };

    const openUpdateDialog = (transaction: FinancialType) => {
        setUpdateDialogData(transaction);
    };
    const closeUpdateDialog = () => {
        setUpdateDialogData(null);
    };

    const updateFetch = async () => {
        await props.fetchTransactionsTypes();
        await props.fetchTransactions();
    };

    const onDeleteIconClick = async (typeGuid: string) => {
        const res = await ServerRequestMaker.MakeDeleteRequest(
            config.ControllerUrls.FinancialTypes.Base + config.ControllerUrls.FinancialTypes.DeleteFinancialType + `${campaignGuid}/${typeGuid}`,
        );
        await updateFetch();
    };

    return (
        <>
            {updateDialogData !== null &&
                <UpdateTransactionTypeDialog transactionType={updateDialogData} closeDialog={closeUpdateDialog}
                                             fetch={updateFetch}/>}
            <AddTransactionTypeDialog switchMode={switchAddTransactionTypeMode}
                                      fetch={props.fetchTransactionsTypes}
                                      isOpen={isAddDialogOpen}/>
            <DeleteDialog values={deleteDialogData} switchMode={closeDeleteDialog} action={onDeleteIconClick}/>

            <Stack sx={{display: "flex", justifyContent: "space-between"}} direction={"row"} spacing={2}>
                <Typography variant="h5" sx={{flexGrow: "1"}}>
                    Transactions Types
                </Typography>
                <Button onClick={switchAddTransactionTypeMode}>Add Type <AddIcon/></Button>
            </Stack>
            <List>
                {props.transactionTypes?.map((type) =>
                    <ListItem key={type.typeGuid} secondaryAction={
                        type.typeName !== "Other" ? <Stack direction="row" spacing={2}>
                            <IconButton aria-label="delete"
                                        onClick={() => openDeleteDialog(type.typeGuid)}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton aria-label="update"
                                        onClick={() => openUpdateDialog(type)}>
                                <UpdateIcon/>
                            </IconButton>
                        </Stack> : null
                    }>
                        <ListItemIcon>
                            <CircleIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={type.typeName}
                            secondary={type.typeDescription}
                        />
                    </ListItem>,
                )}
            </List>
        </>
    );
};