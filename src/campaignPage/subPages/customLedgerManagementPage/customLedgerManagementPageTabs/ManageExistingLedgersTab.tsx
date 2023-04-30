import React, {useEffect, useState} from "react";
import TabCommonProps from "./tab-common-props";
import {Alert, Box, Divider, IconButton, List, Tooltip} from "@mui/material";
import Events from "../../../../utils/helperMethods/events";
import LedgerListItem from "./manageExistingLedgersTabComponents/LedgerListItem";
import RefreshIcon from "@mui/icons-material/Refresh";

function ManageExistingLedgersTab(props: TabCommonProps): JSX.Element {


    const [errorOccurred, setErrorOccurred] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleBubblingError: EventListenerOrEventListenerObject = (evt: Event) => {
        setErrorOccurred(true);
        const error = (evt as CustomEvent).detail;
        setErrorMessage(error);
    };

    useEffect(() => {
        Events.subscribe(Events.EventNames.BubbleErrorUpwards, handleBubblingError);
        return () => {
            Events.unsubscribe(Events.EventNames.BubbleErrorUpwards, handleBubblingError);
        };
    });

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <Tooltip title={"Refresh"}>
                <IconButton color={"primary"} onClick={() => Events.dispatch(Events.EventNames.RefreshCustomLedgers)}
                    sx={{
                        alignSelf: "flex-end",
                    }}>
                    <RefreshIcon/>
                </IconButton>
            </Tooltip>
            <List>
                <Divider sx={{
                    border: "1px solid black",
                    marginBottom: "4px",
                }}/>
                {props.customLedgers.map((ledger, idx) => {
                    return (
                        <div key={idx}>
                            <LedgerListItem ledger={ledger} campaignGuid={props.campaignGuid}/>
                            {idx !== props.customLedgers.length && <Divider sx={{
                                border: "1px solid black",
                                marginBottom: "4px",
                            }}/>}
                        </div>
                    );
                })}
            </List>
            {errorOccurred && <Alert severity={"error"}>{errorMessage}</Alert>}
        </Box>
    );
}

export default ManageExistingLedgersTab;
