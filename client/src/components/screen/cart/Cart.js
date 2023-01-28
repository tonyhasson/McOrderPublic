import classes from './Cart.module.css';
import CartContext from '../../../store/cart-context';
import { useContext, useEffect } from 'react';
import CartItem from './CartItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Cart = (props) => {
  const ctx = useContext(CartContext);
  const { uid, items, removeItem } = ctx;
  const hasItems = items.length > 0;

  const updateCurrOrder = async (array) => {
    try {
      await fetch('http://localhost:5000/record/add', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          items: array,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cartItemRemoveHandler = (id) => {
    removeItem(id);
  };

  useEffect(() => {
    updateCurrOrder(items);
  }, [items]);

  const cartitems = items.map((item) => {
    return (
      <CartItem
        key={item.id}
        id={item.id}
        title={item.title}
        amount={item.amount}
        price={item.price}
        image={item.image}
        // size={item.size}
        onRemove={cartItemRemoveHandler.bind(null, item.id)}
      />
    );
  });

  const orderNum = uid;

  return (
    <div className={hasItems ? classes.cartMain : classes.noItemsList}>
      <div className={classes.itemsList}>
        {hasItems && !props.isPaymentDone && <ul>{cartitems}</ul>}
        {!hasItems && !props.isPaymentDone && (
          <div className={classes.noItemsContainer}>
            <h1 className={classes.noItems}>Your cart is empty..</h1>
            <h3 className={classes.noItemsDesc}>
              Try saying something like: "I would like to order..."
            </h3>
          </div>
        )}
        {props.isPaymentDone && (
          <div className={classes.ThankYou}>
            <h4>Order Number: {orderNum}</h4>
            <h1 className={classes.ThankYouTitle}>Thank you!</h1>
            <h3 className={classes.ThankYouDesc}>
              Your order is being made fresh and fast!
            </h3>
            <CheckCircleIcon className={classes.doneIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
