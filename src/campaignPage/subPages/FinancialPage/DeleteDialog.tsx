import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";


interface DeleteDialogProps {
    switchMode: () => void;
    action: (...args: any[]) => Promise<void>;
    values: any | any[] | null;
    children?: React.ReactNode;
    isOpen?:boolean;
}


export const DeleteDialog = (props: DeleteDialogProps) => {
    if (props.values === null) {
        return (
            <>
            </>
        );
    }

    const f = async () => {
        await props.action(props.values);
        props.switchMode();
    };

    return (
        <Dialog open={props.isOpen ?? true} onClose={props.switchMode}>
            <DialogTitle>Are you Sure?</DialogTitle>
            {props.children !== undefined ? <DialogContent>
                {props.children}
            </DialogContent> : undefined}
            <DialogActions>
                <Button fullWidth onClick={f}>DELETE</Button>
                <Button fullWidth onClick={props.switchMode}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};
