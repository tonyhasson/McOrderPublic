import Screen from "./components/screen/Screen";
import Header from "./components/header/Header";
import CartProvider from "./store/CartProvider";
import "./App.css";
import { useState } from "react";

const App = () => {
  // screen state - 1 = menu , 2 = cart
  const [screenState, setScreenState] = useState(0);

  // opens the payment dialog
  const [isPaymentDialog, setPaymentDialog] = useState(false);

  // opens the items dialog
  const [isItemDialog, setItemDialog] = useState(false);

  // opens the information dialog
  const [isInfoDialog, setInfoDialog] = useState(false);

  // opens the assistance dialog
  const [isAssistDialog, setAssistDialog] = useState(false);

  // if in paying state
  const [isPaying, setIsPaying] = useState(false);

  // if payment is done
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  // sets the decision of accept or decline in payment
  const [decision, setDecision] = useState(0);

  // scroll up or down - true = down , false = up
  const [scrollState, setScrollState] = useState(false);

  // is scrolling
  const [scroll, setScroll] = useState(false);

  // is tts talking
  const [audioPlayerState, setAudioPlayerState] = useState(false);

  return (
    <CartProvider>
      <div className="box">
        <Header
          screenState={screenState}
          isPaymentDialog={isPaymentDialog}
          isInfoDialog={isInfoDialog}
          isAssistDialog={isAssistDialog}
          isPaying={isPaying}
          isPaymentDone={isPaymentDone}
          decision={decision}
          scrollState={scrollState}
          scroll={scroll}
          audioPlayerState={audioPlayerState}
          setScreenState={setScreenState}
          setPaymentDialog={setPaymentDialog}
          setIsPaymentDone={setIsPaymentDone}
          setInfoDialog={setInfoDialog}
          setAssistDialog={setAssistDialog}
          setIsPaying={setIsPaying}
          setDecision={setDecision}
          setScrollState={setScrollState}
          setScroll={setScroll}
          setAudioPlayerState={setAudioPlayerState}
        ></Header>
        <Screen
          screenState={screenState}
          isPaymentDialog={isPaymentDialog}
          isItemDialog={isItemDialog}
          isInfoDialog={isInfoDialog}
          isAssistDialog={isAssistDialog}
          isPaying={isPaying}
          isPaymentDone={isPaymentDone}
          decision={decision}
          scrollState={scrollState}
          scroll={scroll}
          audioPlayerState={audioPlayerState}
          setPaymentDialog={setPaymentDialog}
          setIsPaymentDone={setIsPaymentDone}
          setScreenState={setScreenState}
          setInfoDialog={setInfoDialog}
          setItemDialog={setItemDialog}
          setAssistDialog={setAssistDialog}
          setIsPaying={setIsPaying}
          setDecision={setDecision}
          setScrollState={setScrollState}
          setScroll={setScroll}
          setAudioPlayerState={setAudioPlayerState}
        ></Screen>
      </div>
    </CartProvider>
  );
};

export default App;
