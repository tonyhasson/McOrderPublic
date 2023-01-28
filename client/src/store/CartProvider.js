import { useReducer, useState } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
  feedBack: '',
  sentence: null,
  sentenceArray: [],
  flag: 0,
  micActive: false,
  uid: 17,
  dfData: null,
  currItem: null,
};

const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === 'CLEAR') {
    const updatedAmount = (state.totalAmount = 0);
    const updatedItems = (state.items = []);
    return {
      items: updatedItems,
      totalAmount: updatedAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [currSentence, setCurrSentence] = useState(null);
  const [flagState, setFlagState] = useState(0);
  const [micActive, setMicIsActive] = useState(false);
  const [feedBackTts, setFeedBackTts] = useState('');
  const [user_id, setUser_id] = useState(99);
  const [dialogFlowData, setDialogFlowData] = useState(null);
  const [curItem, setCurItem] = useState(null);
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: 'ADD',
      item: item,
    });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({
      type: 'REMOVE',
      id: id,
    });
  };

  const clearItemsHandler = () => {
    dispatchCartAction({
      type: 'CLEAR',
    });
  };

  const recoverItemsHandler = (array) => {
    cartState.items = array;
    let currTotal = 0;
    array.forEach((item) => {
      currTotal = currTotal + item.price;
    });
    cartState.totalAmount = currTotal;
  };

  const addToSentenceArray = (sentence) => {
    defaultCartState.sentenceArray.push(sentence);
  };

  const setTheFlagState = (state) => {
    setFlagState(state);
  };

  const setTheCurrSentence = (sentence) => {
    setCurrSentence(sentence);
  };

  const setMicActive = () => {
    setMicIsActive(!micActive);
  };

  const setFeedbackHandler = (text) => {
    setFeedBackTts(text);
  };

  const uidHandler = (userId) => {
    setUser_id(userId);
  };

  const setDfDataHandler = (data) => {
    setDialogFlowData(data);
  };

  const setCurrItemHandler = (item) => {
    setCurItem(item);
  };

  const cartContext = {
    items: cartState.items,
    feedBack: feedBackTts,
    totalAmount: cartState.totalAmount,
    sentence: currSentence,
    sentenceArray: defaultCartState.sentenceArray,
    flag: flagState,
    micActive: micActive,
    uid: user_id,
    dfData: dialogFlowData,
    currItem: curItem,
    setFeedback: setFeedbackHandler,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearItems: clearItemsHandler,
    recoverItems: recoverItemsHandler,
    addToSentenceArray: addToSentenceArray,
    setCurrSentence: setTheCurrSentence,
    setFlag: setTheFlagState,
    setMicIsActive: setMicActive,
    setUid: uidHandler,
    setDfData: setDfDataHandler,
    setCurrItem: setCurrItemHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
