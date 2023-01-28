import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, useContext } from 'react';
import CartContext from '../../../store/cart-context';
import classes from './PaymentDialog.module.css';
import axios from 'axios';
import { saveAs } from 'file-saver';

export default function PaymentDialog(props) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const ctx = useContext(CartContext);
  const { uid, items } = ctx;

  //adds current order into final
  const AddToFinal = async (array) => {
    console.log('final');

    try {
      await fetch('http://localhost:5000/record/add/final', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          items: array,
        }),
      });

      axios
        .post('http://localhost:3001/create-pdf', {
          user_id: uid,
          items: array,
        })
        .then(() =>
          axios.get('http://localhost:3001/fetch-pdf', {
            responseType: 'blob',
          })
        )
        .then((res) => {
          console.log(res);
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

          saveAs(pdfBlob, `orderNumber${uid}.pdf`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const ClearCurrentOrder = async () => {
    try {
      await fetch('http://localhost:5000/delete/CurrentOrder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const incUid = () => {
    try {
      fetch('http://localhost:5000/updateUid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          $inc: {
            user_id: 1,
          },
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!clicked && props.isPaymentDialog) {
      setOpen(true);
    }
  }, [props.isPaymentDialog, clicked]);

  // checks for voice payment accept/decline
  useEffect(() => {
    if (props.decision === 1) {
      props.setIsPaymentDone(true);
      //send item through post to FinalOrders

      props.setIsPaying(true);
      props.setScreenState(2);
      AddToFinal(ctx.items);

      setTimeout(() => {
        ClearCurrentOrder();
        // app refresh
        window.location.reload();
        // increament uId
        incUid();
      }, 5000);
    }

    if (props.decision === 2) {
      props.setIsPaymentDone(false);
      props.setIsPaying(false);
    }
    setOpen(false);
    props.setPaymentDialog(false);
    props.setDecision(0);
  }, [props.decision]);

  // -------------------------------------

  const handleClickOpen = () => {
    setClicked(true);
    setOpen(true);
    props.setPaymentDialog(true);
  };

  const handleCloseDecline = () => {
    setClicked(false);
    setOpen(false);
    props.setPaymentDialog(false);
    props.setIsPaying(false);
    props.setIsPaymentDone(false);
  };

  const handleCloseApprove = () => {
    setClicked(false);
    setOpen(false);
    props.setPaymentDialog(false);
    props.setIsPaying(true);
    props.setIsPaymentDone(true);
    ctx.clearItems();
    setTimeout(() => {
      props.setIsPaymentDone(false);
    }, 3000);
  };

  return (
    <div>
      {/* temp */}
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        For Payment
      </Button> */}
      {/* temp */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseDecline}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Payment Dialog'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ margin: 1 }}>
            Would you like to make a payment?
          </DialogContentText>
          <h1 className={classes.totalPaymentAmount}>
            {ctx.totalAmount}
            <span>&#8362;</span>
          </h1>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDecline}>
            Not yet
          </Button>
          <Button onClick={handleCloseApprove} autoFocus>
            Sure
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
