import React, {useEffect, useRef} from "react";
import SubPageWithPermissionBaseProps from "../../../utils/sub-page-with-permission-base-props";
import Ballot from "../../../../models/ballot";
import BallotsTable from "./ballotManagementComponents/BallotsTable";
import {PermissionTypes} from "../../../../models/permission";
import {Stack, Typography} from "@mui/material";
import Events from "../../../../utils/helperMethods/events";

interface ManageBallotsTabProps extends SubPageWithPermissionBaseProps {
    ballots: Ballot[];
    isCustomCampaign: boolean;
    campaignGuid: string;
}

function ManageBallotsTab(props: ManageBallotsTabProps): JSX.Element {

    const changesMade = useRef(false);

    useEffect(() => {
        return () =>{
            if (changesMade.current) {
                Events.dispatch(Events.EventNames.ShouldRefreshBallotsList);
            }
        };
    }, []);

    return (
        <Stack direction={"column"} spacing={3}>
            {!props.isCustomCampaign &&
                <Stack direction={"column"} spacing={1}>
                    <Typography variant={"h4"}>Official ballots</Typography>
                    <BallotsTable editable={false} campaignGuid={props.campaignGuid as string}
                        ballots={props.ballots?.filter(b => !b.isCustomBallot)}
                        changesMade={changesMade}
                    />
                </Stack>
            }
            <Stack direction={"column"} spacing={1}>
                <Typography variant={"h4"}>Custom ballots</Typography>
                <BallotsTable editable={props.permission.permissionType === PermissionTypes.Edit}
                    ballots={props.ballots?.filter(b => b.isCustomBallot)}
                    campaignGuid={props.campaignGuid as string}
                    changesMade={changesMade}
                />
            </Stack>
        </Stack>
    );
}

export default ManageBallotsTab;
