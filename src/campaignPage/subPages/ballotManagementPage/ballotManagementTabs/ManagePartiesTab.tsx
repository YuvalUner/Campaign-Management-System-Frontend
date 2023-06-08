import React from "react";
import SubPageWithPermissionBaseProps from "../../../utils/sub-page-with-permission-base-props";
import Party from "../../../../models/party";

interface ManagePartiesTabProps extends SubPageWithPermissionBaseProps {
    parties: Party[];
    updateParties: React.Dispatch<React.SetStateAction<Party[]>>
}

function ManagePartiesTab(props: ManagePartiesTabProps): JSX.Element {
    return <div>AddPartyTab</div>;
}

export default ManagePartiesTab;
