import classes from './Menu.module.css';
import Product from './Product';
import menuItems from '../../../menu.json';
import { useContext, useEffect, useRef } from 'react';
import CartContext from '../../../store/cart-context';

const Menu = (props) => {
  const ctx = useContext(CartContext);
  const { uid, items } = ctx;
  const menuRef = useRef(null);

  // on product click handler
  const cartItemHandler = (item) => {
    ctx.addItem({ ...item, amount: 1 });
  };

  // inserts to mongo the current order - fix to PUT
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

  // calls the mongo post only when items change
  useEffect(() => {
    updateCurrOrder(items);
  }, [items]);

  // creates a product item
  const availProducts = menuItems.map((p) => {
    return (
      <Product
        key={p.id}
        title={p.title}
        price={p.price}
        image={p.image}
        onAdd={cartItemHandler.bind(null, p)}
      />
    );
  });

  // scrolling in the menu
  const scrollPage = (ref) => {
    ref.current.scrollBy({
      top: props.scrollState ? 650 : -650,
      behavior: 'smooth',
    });
  };

  if (props.scroll) {
    scrollPage(menuRef);
    props.setScroll(false);
  }
  // ----------------------

  return (
    <div className={classes.menuBox} ref={menuRef}>
      <div className={classes.menuMain}>{availProducts}</div>
    </div>
  );
};

export default Menu;
