import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SendIcon from '@mui/icons-material/Send';
import "../ProfilePage";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleClickOpen = () => {
    setOpenAlert(true);
  };

  const handleClose = () => {
    setOpenAlert(false);
  };

  return (
    <div>
      <button className='info-button' onClick={handleClickOpen}>
        INFO
      </button>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Profile Page"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Please fill in your personal details to get verified
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ "&:hover": { backgroundColor: "#9b9c9d" } }} onClick={handleClose} endIcon={<SendIcon />}></Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}