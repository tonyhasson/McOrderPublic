import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState, useContext, useEffect } from "react";
import CartContext from "../../../store/cart-context";
import classes from "./ItemDialog.module.css";

export default function ItemDialog(props) {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const ctx = useContext(CartContext);

  useEffect(() => {
    if (!clicked && props.isItemDialog) {
      setOpen(true);
    }
    if (!clicked && !props.isItemDialog) {
      setOpen(false);
    }
  }, [props.isItemDialog, clicked]);

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
          {"Please validate your item"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ margin: 1 }}>
            Is this your item?
          </DialogContentText>
        </DialogContent>
        <img
          className={classes.itemImg}
          src={ctx.currItem?.image}
          alt={ctx.currItem?.title}
        />
        <h2 className={classes.itemTitle}>
          {ctx.currItem?.size ? ctx.currItem?.size + " " : ""}
          {ctx.currItem?.title}
        </h2>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDecline}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
