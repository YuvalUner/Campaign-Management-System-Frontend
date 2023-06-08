import React from "react";
import SubPageWithPermissionBaseProps from "../../../utils/sub-page-with-permission-base-props";
import Ballot from "../../../../models/ballot";
import BallotsTable from "./ballotManagementComponents/BallotsTable";
import {PermissionTypes} from "../../../../models/permission";
import {Stack, Typography} from "@mui/material";

interface ManageBallotsTabProps extends SubPageWithPermissionBaseProps {
    ballots: Ballot[];
    updateBallots: React.Dispatch<React.SetStateAction<Ballot[]>>
    isCustomCampaign: boolean;
}

function ManageBallotsTab(props: ManageBallotsTabProps): JSX.Element {
    return (
        <Stack direction={"column"} spacing={3}>
            {!props.isCustomCampaign &&
                <Stack direction={"column"} spacing={1}>
                    <Typography variant={"h4"}>Official ballots</Typography>
                    <BallotsTable editable={false}
                        ballots={props.ballots?.filter(b => !b.isCustomBallot)}/>
                </Stack>
            }
            <Stack direction={"column"} spacing={1}>
                <Typography variant={"h4"}>Custom ballots</Typography>
                <BallotsTable editable={props.permission.permissionType === PermissionTypes.Edit}
                    ballots={props.ballots?.filter(b => b.isCustomBallot)}/>
            </Stack>
        </Stack>
    );
}

export default ManageBallotsTab;
