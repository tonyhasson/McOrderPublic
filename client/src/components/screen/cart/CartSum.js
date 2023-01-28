import classes from './CartSum.module.css';
import context from '../../../store/cart-context';
import { useContext } from 'react';

const CartSum = (props) => {
  const ctx = useContext(context);
  const totalAmount = `${ctx.totalAmount.toFixed(2)}`;

  return (
    <div className={classes.cartSum}>
      <div className={classes.totalSum}>
        <div className={classes.titleTotalSum}>
          <h1>Total Amount: </h1>
        </div>
        <div className={classes.total}>
          {totalAmount} <span>&#8362;</span>
        </div>
      </div>
    </div>
  );
};

export default CartSum;
