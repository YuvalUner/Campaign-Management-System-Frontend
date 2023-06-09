import React, {useEffect} from "react";
import SubPageWithPermissionBaseProps from "../../../utils/sub-page-with-permission-base-props";
import Party from "../../../../models/party";
import Events from "../../../../utils/helperMethods/events";
import {Stack, Typography} from "@mui/material";
import PartiesTable from "./partyManagementComponents/PartiesTable";
import { PermissionTypes } from "../../../../models/permission";

interface ManagePartiesTabProps extends SubPageWithPermissionBaseProps {
    parties: Party[];
    updateParties: React.Dispatch<React.SetStateAction<Party[]>>
    campaignGuid: string;
}

function ManagePartiesTab(props: ManagePartiesTabProps): JSX.Element {

    const changesMade = React.useRef<boolean>(false);

    useEffect(() => {
        return () =>{
            if (changesMade.current) {
                Events.dispatch(Events.EventNames.ShouldRefreshPartyList);
            }
        };
    }, []);

    return (
        <Stack direction={"column"} spacing={3}>
            <Stack direction={"column"} spacing={1}>
                <Typography variant={"h4"}>Custom Parties</Typography>
                <PartiesTable editable={props.permission.permissionType === PermissionTypes.Edit}
                    parties={props.parties} campaignGuid={props.campaignGuid} changesMade={changesMade}/>
            </Stack>
        </Stack>
    );
}

export default ManagePartiesTab;
