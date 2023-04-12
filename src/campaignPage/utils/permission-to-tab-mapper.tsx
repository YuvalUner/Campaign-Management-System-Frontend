import React from "react";
import Permission, {PermissionTargets} from "../../models/permission";
import MenuListItem from "./menu-list-item";
import BallotIcon from "@mui/icons-material/Ballot";
import VotersLedgerTab from "../TabPages/VotersLedgerTab";
import TabNames from "./tabNames";
import ErrorIcon from "@mui/icons-material/Error";
import NotFoundPage from "../../notFoundPage/NotFoundPage";

/**
 * A function for mapping between permissions and the tabs they grant access to.
 * @param permission The permission to map.
 * @param closeFunction
 */
function PermissionToTabMapper(permission: Permission, closeFunction: (tab: string) => void): MenuListItem {
    switch (permission.permissionTarget) {
    case PermissionTargets.VotersLedger:
        return {
            name: TabNames.VotersLedger,
            icon: <BallotIcon/>,
            tab: {
                header: {text: TabNames.VotersLedger},
                component: () => {
                    return <VotersLedgerTab name={TabNames.VotersLedger}
                        closeFunction={closeFunction} permission={permission}/>;
                }
            }
        };
    default:
        return {
            name: "Unknown",
            icon: <ErrorIcon/>,
            tab: {
                header: {text: "Unknown"},
                component: () => {
                    return <NotFoundPage errorMessage={"If you are seeing this page, congratulations!" +
                        " You have found a bug in the system. Please report it to the developers." +
                        " Well, that, or we haven't implemented the page yet."}/>;
                }
            }
        };
    }
}

export default PermissionToTabMapper;
