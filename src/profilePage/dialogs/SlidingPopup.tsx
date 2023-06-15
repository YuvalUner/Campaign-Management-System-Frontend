import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import SendIcon from "@mui/icons-material/Send";
import "../ProfilePage";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface SlidingPopupProps {
    isOpen: boolean;
    message: string;
    onClose:()=>void;
    onConfirm?:()=>void;
}

export const SlidingPopup = (props: SlidingPopupProps) => {
    return (
        <Dialog
            open={props.isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Profile Page"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size={"large"} onClick={props.onConfirm ?? props.onClose}
                    endIcon={<SendIcon sx={{"&:hover": {backgroundColor: "#9b9c9d"}}}/>}></Button>
            </DialogActions>
        </Dialog>
    );
};
