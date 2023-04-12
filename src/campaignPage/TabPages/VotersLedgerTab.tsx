import React from "react";
import CloseTabButton from "../utils/CloseTabButton";
import TabPageBasePropsWithPermission from "../utils/tab-page-base-props-with-permission";

function VotersLedgerTab(props: TabPageBasePropsWithPermission): JSX.Element {
    return (
        <>
            <CloseTabButton tabName={props.name} closeFunction={props.closeFunction}/>
            <h1>Voters Ledger</h1>
        </>
    );
}

export default VotersLedgerTab;
