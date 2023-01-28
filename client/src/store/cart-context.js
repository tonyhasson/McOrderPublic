import React from 'react';

const CartContext = React.createContext({
  items: [],
  feedBack: '',
  totalAmount: 0,
  sentence: null,
  sentenceArray: [],
  flag: 0,
  micActive: false,
  uid: 17,
  dfData: null,
  currItem: null,
  setFeedback: (text) => {},
  addItem: (item) => {},
  removeItem: (id) => {},
  clearItems: () => {},
  recoverItems: (array) => {},
  addToSentenceArray: (sentence) => {},
  setCurrSentence: (sentence) => {},
  setFlag: (state) => {},
  setMicIsActive: () => {},
  setUid: (userId) => {},
  setDfData: (data) => {},
  setCurrItem: (item) => {},
});

export default CartContext;
