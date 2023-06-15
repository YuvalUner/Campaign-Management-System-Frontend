import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import UserWithRole from "../../../models/user-with-role";
import Grid from "@mui/material/Unstable_Grid2";
import ServerRequestMaker from "../../../utils/helperMethods/server-request-maker";
import config from "../../../app-config.json";
import {useParams} from "react-router-dom";
import permission from "../../../models/permission";
import axios from "axios";

interface PermissionsDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    refresh: () => void;
    userToChange: UserWithRole | null;
    currentUserPermissions: permission[] | null;
}

interface PermissionChoose extends permission {
    disabled: boolean;
    init: boolean;

}

export const PermissionsDialog = (props: PermissionsDialogProps) => {
    const params = useParams();
    const campaignGuid = params.campaignGuid;

    const [initPermissions, setInitPermissions] = useState<permission[] | null>(null);
    const [chosenPermissions, setChosenPermissions] = useState<permission[] | null>(null);
    const [addedPermissions, setAddedPermissions] = useState<permission[]>([]);
    const [removedPermissions, setRemovedPermissions] = useState<permission[]>([]);

    const getPermission = async () => {

        if (props.userToChange === null || props.userToChange === undefined) {
            return;
        }

        const res = await ServerRequestMaker.MakeGetRequest(
            config.ControllerUrls.Permissions.Base +
            config.ControllerUrls.Permissions.GetPermissions +
            `${campaignGuid}/${props.userToChange.email}`,
        );
        const permissions = res.data as permission[];
        const uniqe = permissions.filter((item, pos, self) =>
            pos === self.findIndex((t) => (
                t.permissionTarget === item.permissionTarget
            )),
        );
        setInitPermissions(uniqe);
        return uniqe;
    };

    const assignPermission = async (perm: permission) => {
        const res = await ServerRequestMaker.MakePostRequest(
            config.ControllerUrls.Permissions.Base +
            config.ControllerUrls.Permissions.AddPermission +
            `${campaignGuid}/${props.userToChange?.email}`,
            perm,
        );
    };

    const removePermission = async (perm: permission) => {
        const res = await axios.delete(
            config.ControllerUrls.Roles.Base +
            config.ControllerUrls.Roles.AssignAdminRole +
            `${campaignGuid}/${props.userToChange?.email}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                data: perm,
            },
        );
    };

    useEffect(() => {
        const f = async () => {
            const r = await getPermission();
            if (r === null || r === undefined) {
                return;
            }
            // setInitPermissions(r);
        };
        if (props.userToChange === null || props.userToChange === undefined) {
            return;
        }
        f();
    }, [props.userToChange]);

    const submit = async () => {
        addedPermissions.forEach((v) => assignPermission(v));
        removedPermissions.forEach((v) => removePermission(v));

        await props.refresh();
        props.switchMode();
    };

    const permSetter = (perm: permission): {
        color: "default" | "success" | "error" | "primary",
        disabled: boolean
    } | undefined => {
        if (initPermissions === null) {
            return undefined;
        }

        const inInit = initPermissions.includes(perm);
        const inAdded = addedPermissions.includes(perm);
        const inRemoved = removedPermissions.includes(perm);

        if (!inInit) {
            return {color: "default", disabled: false};
        } else if (inAdded) {
            return {color: "success", disabled: false};
        } else if (inRemoved) {
            return {color: "error", disabled: false};
        }
        return {color: "primary", disabled: false};
    };

    const switchPermission = (perm: permission, setter: React.Dispatch<React.SetStateAction<permission[]>>) => {
        return () => {
            setter((prev) => {
                if (prev.includes(perm)) {
                    return prev.filter(item => item !== perm);
                }
                return [...prev, perm];
            });
        };
    };

    const createonClick = (perm: permission) => {
        if (initPermissions === null) {
            // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
            return () => {
            };
        }

        if (initPermissions.includes(perm)) {
            return switchPermission(perm, setRemovedPermissions);
        }
        return switchPermission(perm, setAddedPermissions);
    };

    return (
        <>
            <Dialog open={props.isOpen} onClose={props.switchMode}>
                <DialogTitle>Change Role</DialogTitle>
                <DialogContent>
                    <Stack direction={"column"} spacing={3}>
                        <Grid container spacing={3}>
                            {initPermissions?.map((perm, i) => {
                                const setting = permSetter(perm);
                                if (setting === undefined) {
                                    return;
                                }
                                return (
                                    <Grid key={perm.permissionTarget}>
                                        <Chip color={setting.color} label={perm.permissionTarget}
                                            disabled={setting.disabled}
                                            onClick={createonClick(perm)}/>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={submit}
                        disabled={false}>Change</Button>
                    <Button fullWidth onClick={props.switchMode}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
