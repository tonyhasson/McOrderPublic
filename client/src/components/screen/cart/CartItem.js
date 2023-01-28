import classes from './CartItem.module.css';

const CartItem = (props) => {
  return (
    <li className={classes.singleItem} onClick={props.onRemove}>
      <div>
        <img
          className={classes.itemImg}
          src={props.image}
          alt={props.title}
        ></img>
      </div>
      <div className={classes.itemContent}>
        <div className={classes.itemInfo}>
          <h3 className={classes.itemTitle}>{props.title}</h3>
          {/* {props.size && <h3 className={classes.itemSize}> {props.size}</h3>} */}
        </div>
        <div className={classes.details}>
          <h3 className={classes.itemQty}>x{props.amount}</h3>
          <h3 className={classes.itemQty}>
            {props.price * props.amount}
            <span>&#8362;</span>
          </h3>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
