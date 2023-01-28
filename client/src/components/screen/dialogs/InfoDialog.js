import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

export default function InfoDialog(props) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!clicked && props.isInfoDialog) {
      setOpen(true);
    }
    if (!clicked && !props.isInfoDialog) {
      setOpen(false);
    }
  }, [props.isInfoDialog, clicked]);

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
          {'How to use McOrder?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ margin: 1 }}>
            Welcome to McOrder, McDonald's drive-thru chat service! To place an
            order, simply tell me the name of the item you'd like to order. For
            example, you can say "I'd like a Big Mac" or "Can I get a
            McChicken?".
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            While validating your pick, please supply a simple "yes" or "no"
            answer. it could also be something like "sure" or "not really", but
            keep it simple with no extras.
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            If you need to see our menu options before ordering, just say
            something like "show me the menu" or "can i see a menu please?".
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            You can scroll up or down the menu while saying something like
            "scroll up" or "go down".
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            To review your current order, you can say something like "show me my
            cart" or "what did i order?".
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            To empty your cart you can say something like "please empty my cart"
            or "clear my order".
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            To proceed with the payment, you can say "I want to pay" or "That's
            all" and we will process your payment.
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            If you have any trouble or need assistance at any time, you can say
            something like "I'm stuck" or "I have a problem", and we will be
            glad to assist you.
          </DialogContentText>
          <DialogContentText sx={{ margin: 1 }}>
            Thank you for choosing McDonald's and McOrder for your fast food
            needs! Let us know if you need any assistance.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleCloseDecline}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
