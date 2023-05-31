import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, {useEffect, useState} from "react";
import Role from "../../../models/role";
import UserWithRole from "../../../models/user-with-role";
import Grid from "@mui/material/Unstable_Grid2";

interface RolesDialogProps {
    isOpen: boolean;
    switchMode: () => void;
    refresh: () => void;
    roles: Role[] | null;
    user: UserWithRole | null;
}


export const RolesDialog = (props: RolesDialogProps) => {
    const [chosenRole, setChosenRole] = useState<string>();

    useEffect(() => {
        // setChoosedRole(props.roles?.find((role) => role.roleName === props.user?.roleName));
        setChosenRole(props.user?.roleName);
    }, [props.user]);

    const changeRole = async () => {
        console.log("change submit");
    };

    const colorPicker = (roleName: string) => {
        if (roleName === chosenRole) {
            return "success";
        } else if (roleName === props.user?.roleName) {
            return "info";
        }
        return undefined;

    };

    return (
        <>
            <Dialog open={props.isOpen} onClose={props.switchMode}>
                <DialogTitle>Change Role</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {props.roles?.map((role, i) =>
                            <Grid key={role.roleName}>
                                <Chip color={colorPicker(role.roleName)}
                                      onClick={() => setChosenRole(role.roleName)} label={role.roleName}/>
                            </Grid>,
                        )}
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={changeRole}
                            disabled={chosenRole === props.user?.roleName}>Change</Button>
                    <Button fullWidth onClick={props.switchMode}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
