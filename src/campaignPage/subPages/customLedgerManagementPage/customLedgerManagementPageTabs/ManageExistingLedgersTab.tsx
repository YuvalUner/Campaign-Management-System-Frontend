import React from "react";
import TabCommonProps from "./tab-common-props";
import {Box, Divider, IconButton, List, ListItem, ListItemText, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ManageExistingLedgersTab(props: TabCommonProps): JSX.Element {

    return (
        <Box>
            <List>
                <Divider sx={{
                    border: "1px solid black",
                    marginBottom: "4px",
                }}/>
                {props.customLedgers.map((ledger, idx) => {
                    return (
                        <>
                            <ListItem key={idx} secondaryAction={
                                <>
                                    <Tooltip title={"Edit ledger name"} sx={{
                                        marginRight: "24px"
                                    }}>
                                        <IconButton edge={"end"} >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={"Delete ledger"}>
                                        <IconButton edge={"end"} color={"error"}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }>
                                <ListItemText primary={ledger.ledgerName}/>
                            </ListItem>
                            {idx !== props.customLedgers.length && <Divider sx={{
                                border: "1px solid black",
                                marginBottom: "4px",
                            }}/>}
                        </>
                    );
                })}
            </List>
        </Box>
    );
}

export default ManageExistingLedgersTab;
