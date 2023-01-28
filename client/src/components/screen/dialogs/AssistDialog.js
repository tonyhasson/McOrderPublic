import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

export default function AssistDialog(props) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!clicked && props.isAssistDialog) {
      setOpen(true);
    }
    if (!clicked && !props.isAssistDialog) {
      setOpen(false);
    }
  }, [props.isAssistDialog, clicked]);

  const handleCloseDecline = () => {
    setClicked(false);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseDecline}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'McHelp to the Rescue: Assistance on the way!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ margin: 1 }}>
            Don't worry, you're not alone! Our McHelp team has received your
            request for assistance and a friendly employee will be with you
            shortly to help you out. Thanks for your patience! 🍔🍟
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
