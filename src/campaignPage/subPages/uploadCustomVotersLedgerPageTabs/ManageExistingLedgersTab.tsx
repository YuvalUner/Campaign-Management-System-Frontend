import React, {useEffect, useState} from "react";
import TabCommonProps from "./tab-common-props";
import CustomVotersLedger from "../../../models/custom-voters-ledger";
import ServerRequestMaker from "../../../utils/server-request-maker";
import config from "../../../app-config.json";
import {List} from "@mui/material";

function ManageExistingLedgersTab(props: TabCommonProps): JSX.Element {

    const [customLedgers, setCustomLedgers] = useState<CustomVotersLedger[]>([]);

    useEffect(() => {
        ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.CustomVotersLedger.Base +
            config.ControllerUrls.CustomVotersLedger.GetForCampaign + props.campaignGuid
        ).then((response) => {
            setCustomLedgers(response.data);
        });
    }, []);

    return (
        <List>
            {customLedgers.map((ledger) => {
                return <h1 key={ledger.ledgerGuid as string}>{ledger.ledgerName + ":" + ledger.ledgerGuid}</h1>;
            })}
        </List>
    );
}

export default ManageExistingLedgersTab;
