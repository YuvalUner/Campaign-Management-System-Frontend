import React, {useState} from "react";
import {IconButton, ListItem, ListItemText, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomVotersLedger from "../../../../../models/custom-voters-ledger";
import UpdateNameDialog from "./UpdateNameDialog";
import DeleteLedgerDialog from "./DeleteLedgerDialog";

interface LedgerListItemProps {
    ledger: CustomVotersLedger;
    campaignGuid: string;
}

function LedgerListItem(props: LedgerListItemProps): JSX.Element {

    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const onUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const openUpdateDialog = () => {
        setUpdateDialogOpen(true);
    };

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    return (
        <>
            <ListItem secondaryAction={
                <>
                    <Tooltip title={"Edit ledger name"} sx={{
                        marginRight: "24px"
                    }}>
                        <IconButton edge={"end"} onClick={openUpdateDialog}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Delete ledger"}>
                        <IconButton edge={"end"} color={"error"} onClick={openDeleteDialog}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </>
            }>
                <ListItemText primary={props.ledger.ledgerName}/>
            </ListItem>
            <UpdateNameDialog open={updateDialogOpen} onClose={onUpdateDialogClose}
                customLedger={props.ledger} campaignGuid={props.campaignGuid}/>
            <DeleteLedgerDialog open={deleteDialogOpen} onClose={onDeleteDialogClose}
                customLedger={props.ledger} campaignGuid={props.campaignGuid}/>
        </>
    );
}

export default LedgerListItem;
