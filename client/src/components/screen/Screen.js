import MainPage from './mainPage/MainPage';
import classes from './Screen.module.css';
import Menu from '../screen/menu/Menu';
import Background from './bg/Background';
import Cart from './cart/Cart';
import CartSum from './cart/CartSum';
import PaymentDialog from './payment/PaymentDialog';
import { useState, useContext, useRef, useEffect } from 'react';
import CartContext from '../../store/cart-context';
import ItemDialog from '../screen/dialogs/ItemDialog';
import menuJson from '../../menu.json';
import InfoDialog from './dialogs/InfoDialog';
import AssistDialog from './dialogs/AssistDialog';

export default function Screen(props) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const cartRef = useRef(null);

  const ctx = useContext(CartContext);
  const { items, dfData, setCurrItem, currItem, addItem } = ctx;

  const hasItems = items.length > 0;

  // hide the loader once the video is loaded
  const onVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // scrolling all pages

  const scrollPage = (ref) => {
    ref.current.scrollBy({
      top: props.scrollState ? 650 : -650,
      behavior: 'smooth',
    });
  };

  if (props.scroll) {
    scrollPage(cartRef);
    props.setScroll(false);
  }
  // ----------------------

  // check for correct product intent and get the product name from df
  useEffect(() => {
    // get the current item from the dialogFlow BEFORE validation
    if (dfData?.intent?.displayName === 'order') {
      const object = dfData.parameters.fields;
      //const keys = ["dessert", "burger", "size", "drink", "sides", "chicken"];
      const keys = ['dessert', 'burger', 'drink', 'sides', 'chicken'];
      const key_size = 'size';
      var value_size = null;

      //get the value of size if there is any
      try {
        value_size = Object.entries(object).find(([key, value]) => {
          return key_size.includes(key) && value.stringValue !== '';
        })[1].stringValue;
      } catch {
        value_size = null;
      }

      //get the type of the product
      const key = Object.entries(object).find(([key, value]) => {
        return keys.includes(key) && value.stringValue !== '';
      })[0];

      //if the product type is something besides "sides" or "drink" then find it
      if (key !== 'sides' && key !== 'drink') {
        const value = Object.entries(object).find(([key, value]) => {
          return keys.includes(key) && value.stringValue !== '';
        })[1].stringValue;

        console.log(key, value);

        menuJson.forEach((item) => {
          if (item.title === value) {
            setCurrItem(item);
            props.setItemDialog(true);
            return;
          }
        });
      }

      //new version with size entered in the beginning
      if ((key === 'sides' || key === 'drink') && value_size !== null) {
        console.log('new version');

        const value = Object.entries(object).find(([key, value]) => {
          return keys.includes(key) && value.stringValue !== '';
        })[1].stringValue;

        console.log(key, value);
        console.log(value_size, value);
        menuJson.forEach((item) => {
          if (item.title === value_size + ' ' + value) {
            console.log('here');
            setCurrItem(item);
            props.setItemDialog(true);
            return;
          }
        });
      }
    }
    //if the product type is "sides" or "drink" you will continue here and choose your size
    else if (dfData?.intent?.displayName === 'order_size') {
      const object = dfData.parameters.fields;
      const keys_product = ['sides', 'drink'];
      const size_key = ['size'];

      //find the name of the product
      const value = Object.entries(object).find(([key, value]) => {
        console.log(keys_product.includes(key) && value.stringValue !== '');
        return keys_product.includes(key) && value.stringValue !== '';
      })[1].stringValue;

      //find the desired size
      const size_value = Object.entries(object).find(([key, value]) => {
        return size_key.includes(key) && value.stringValue !== '';
      })[1].stringValue;

      menuJson.forEach((item) => {
        if (item.title === size_value + ' ' + value) {
          setCurrItem(item);
          props.setItemDialog(true);
          return;
        }
      });
    }

    //------------------------------------------------------

    // validate the current item from the dialogFlow DURING validation
    else if (dfData?.intent?.displayName === 'Order - Correct Product') {
      if (currItem !== null) {
        addItem({ ...currItem, amount: 1 });
        props.setItemDialog(false);
      }
    }
    //if the product is incorrect
    else if (dfData?.intent?.displayName === 'Order - Incorrect Product') {
      props.setItemDialog(false);
    }
    //if the DialogFlow bot didn't recognize what the user said for some reason
    else if (
      dfData?.intent?.displayName === 'Default Fallback Intent' ||
      dfData?.intent?.displayName ===
        'Order - Correct Product - Go To Payment - fallback'
    ) {
      if (mistakes === 3) {
        props.setInfoDialog(true);
      } else if (mistakes === 8) {
        props.setAssistDialog(true);
      }
      setMistakes(mistakes + 1);
    }
  }, [dfData]);

  return (
    <div className={classes.fullScreen}>
      <div className={classes.containerBox}>
        <div className={classes.bg}>
          <Background
            screenState={props.screenState}
            videoLoaded={videoLoaded}
            audioPlayerState={props.audioPlayerState}
            setVideoLoaded={setVideoLoaded}
            onVideoLoaded={onVideoLoaded}
            setAudioPlayerState={props.setAudioPlayerState}
          />
        </div>
        <ItemDialog
          isItemDialog={props.isItemDialog}
          setItemDialog={props.setItemDialog}
        />
        <InfoDialog
          isInfoDialog={props.isInfoDialog}
          setInfoDialog={props.setInfoDialog}
        />
        <AssistDialog
          isAssistDialog={props.isAssistDialog}
          setAssistDialog={props.setAssistDialog}
        />
        {hasItems && (
          <PaymentDialog
            isPaymentDialog={props.isPaymentDialog}
            isPaying={props.isPaying}
            isPaymentDone={props.isPaymentDone}
            decision={props.decision}
            setPaymentDialog={props.setPaymentDialog}
            setIsPaying={props.setIsPaying}
            setDecision={props.setDecision}
            setIsPaymentDone={props.setIsPaymentDone}
            setScreenState={props.setScreenState}
          />
        )}
        {props.screenState === 1 && (
          <div className={classes.menu} ref={cartRef}>
            <Menu
              screenState={props.screenState}
              scrollState={props.scrollState}
              scroll={props.scroll}
              setScroll={props.setScroll}
            />
          </div>
        )}
        {props.screenState === 2 && (
          <div className={classes.cart} ref={cartRef}>
            <Cart
              isPaymentDialog={props.isPaymentDialog}
              isPaying={props.isPaying}
              isPaymentDone={props.isPaymentDone}
              scrollState={props.scrollState}
              scroll={props.scroll}
              setPaymentDialog={props.setPaymentDialog}
              setIsPaying={props.setIsPaying}
              setScroll={props.setScroll}
            />
          </div>
        )}
        {props.screenState === 0 && videoLoaded && (
          <div className={classes.MainPage} ref={cartRef}>
            <MainPage
              screenState={props.screenState}
              audioPlayerState={props.audioPlayerState}
              setIsPaymentDone={props.setIsPaymentDone}
              setAudioPlayerState={props.setAudioPlayerState}
            />
          </div>
        )}
        {props.screenState === 2 && <CartSum />}
      </div>
      <h4 className={classes.copy}>
        Created by Lior Fridman and Tony Hasson &#169;
      </h4>
    </div>
  );
}
