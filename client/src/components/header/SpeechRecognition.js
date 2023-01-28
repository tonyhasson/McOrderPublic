import { useRef, useEffect, useContext } from 'react';
import CartContext from '../../store/cart-context';
import axios from 'axios';

const GREETINGS_REGEX =
  /hello mcdonald's|hi mcdonald's|hey mcdonald's|ok mcdonald's|okay mcdonald's|hello mcdonald|hi mcdonald|hey mcdonald|ok mcdonald|okay mcdonald|hello mcorder|hi mcorder|hey mcorder|ok mcorder|okay mcorder|hi mc order|ok mc order|okay mc order|hello mac order|hi mac order|hey mac order|ok mac order|okay mac order/;
const MENU_REGEX =
  /menu|food|dessert|show me what you got|whats' on the menu|what burgers do you have|eat|i don't know what to choose|hungry|thirsty|you sell|what can i order|Show me the menu|What food options do you have|I'm hungry|what can I eat|Looking for something to eat|what do you have|I want to see the food options|lunch|What are the dinner options|I want to see the full list of items|I need to know what food is available|I'm looking for something specific|what to eat/;
const CART_REGEX =
  /cart|bought|show me what i have|what i got|bag|show me my order|show me the card|show me what i ordered so far|show me my current order|show me what i've ordered|show my order|total|amount|how much|items|show me what i've got|go to my order|i want to see my order|i want to see what i've ordered|i want to see what i ordered/;
const PAYMENT_REGEX =
  /to pay|checkout|finished|done|I would like to finish my order|i am done|let's pay|i would like to pay|that's it|that is it|can i pay|finish|finish my order|finish the order|payment|that's all|I want to pay|Can I pay now|How do I pay for this|What are the payment options|I want to use a credit card|I want to use a debit card|I want to use my bank account|I want to use my mobile wallet|I want to use my gift card|I want to pay with cash|I need to pay for my order|Can I pay with a check|What's the total cost|How do I complete the payment|I need to enter my payment information|Can I enter my payment details|I want to confirm my payment|I'm ready to pay, how do I do it|I need to pay for my purchase|What's the best way to pay|I want to pay with a different method|I want to pay online|I want to pay with my phone|I want to pay with Apple Pay|I want to pay with Google Pay|I want to pay with PayPal|I want to pay with cash app|check out|check-out/;
const ASSISTANCE_REGEX =
  /i need an employee|something is not working|something's not working|i am new here|i'm new here|i'm new to this|i am new to this|i am a new customer|i'm a new customer|give me an employee|i need some further assistance|i'm stuck|problem|it's stuck|it's jammed|it's not working|i need a cashier|i have a problem|there's a problem|can i speak to an employee|i am experiencing a problem|i am having technical difficulties|i am having an issue|i am having trouble|can you help me with this|can you assist me with this|i am having a malfunction|call a worker|it looks like an error|call an employee|i am having an error|can you call an employee|i need help with this|i need assistance with this|i am having a technical issue|can you help me with a problem|can you assist me with an issue|i am having trouble with this|i am experiencing an error|can you call for an employee|i need help with an error|i need assistance with a malfunction|need help here|employee needed|issue with the system|system malfunction|need assistance|having trouble|help me with this|call employee|assist me|error occurred|technical difficulties|can't proceed|need help now|need an employee|system not working|help with this|can't use this|malfunctioning|can't understand|need help please|calling for an employee|can't complete this|employee assistance|problem with the system|help me fix this|system error|need technical help/;
const HELP_REGEX =
  /help me|what sould i say|i need some help|what sizes do you have|how can i order|i don't know what to say|something is wrong|i don't know what to do|tell me what to do|tell me how to|how to do things|how to order|how to use this|how can i use you|how can i use this|what can i do here|how does this work|what are my options|can you assist me|i need help|what do i do|how do i order|how do i pay|what are the menu options|what are the prices|how do i see my cart|how do i clear my cart|what are the payment methods|i am confused|i don't understand|i need guidance|what are the commands|how do i get started|how do i proceed|i am new here|can you explain|can you give me more information|i am not sure|what do i say|how do i use this service|what are the steps|can you walk me through this|i need some direction|i am lost/;
const CLEAR_REGEX =
  /clear my cart|clear cart|clean my cart|clean my order|I would like to delete my cart|I would like to remove my cart|delete all of those|delete my order|delete all my cart|remove all my cart|remove all the items|remove all of those|remove all items|delete all items|erase all items|remove the items|remove all my items|erase the items|delete the items|cancel my order|empty my order|erase my order|i want to start again|i want to order again from the start|i want to order again from the beginning|forget all my items|ignore all my items|start from to top|start from the beginning|ignore my current order|i want to start from the beginning|remove all items from my cart|start over with my order|empty my cart|i want to start again|let's start again|start my order again|let's start over|clear the cart|cancel the order|remove all items from the cart|start over on the order|empty the cart/;
const DIALOG_REGEX_CONFIRM =
  /yes|confirm|absolutely|i do|i am|sure|why not|ok|yeah|okay|yep|definitely|agreed|understood|alright|sounds good|sure thing|no problem|of course|that works for me|i'm on board|i'm in|i agree|i'm game|let's do it|count me in|sign me up|i'm all in|yep|ok|okay|got it/;
const DIALOG_REGEX_DECLINE =
  /no|not yet|not sure|nope|maybe|later|in a moment|nah|absolutely not|on second thought|negative|declined|rejected|disagreed|cancelled|aborted|not happening|not a chance|no way|forget it|not interested|i don't think so|i'm sorry, no|i can't|i'm afraid not|i'm sorry, but no|that won't work for me|i don't think that's a good idea|i'm sorry, i can't do that|i'm sorry, i have to decline|i'm sorry, i can't accept|i'm sorry, i'm not able to do that|i'm sorry, i have to pass on this|i'm sorry, i'm not available for that/;
const SCROLL_DOWN_REGEX = /down|scroll down|show me down|go down|lower page/;
const SCROLL_UP_REGEX = /up|scroll up|show me up|go up|upper page/;
const MORE_SCROLL_REGEX =
  /more|again|another time|scroll more|show me more|one more time/;

const SpeechRecognition = (props) => {
  const ctx = useContext(CartContext);
  const {
    flag,
    addToSentenceArray,
    setFlag,
    setCurrSentence,
    setMicIsActive,
    uid,
    clearItems,
  } = ctx;
  var flagRef = useRef(false);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    flagRef.current = props.audioPlayerState;
  }, [props.audioPlayerState]);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const speechRecognition = new window.webkitSpeechRecognition();

      speechRecognitionRef.current = speechRecognition;

      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      // starts the recognition

      speechRecognition.start();

      //-----------------------

      speechRecognition.addEventListener('result', (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase();

        const sendToDF = async () => {
          try {
            const response = await axios.post(
              'http://localhost:4000/dialogflow',
              {
                queryText: transcript,
                sessionId: uid,
                languageCode: 'en',
              }
            );
            // console.log(response.data.fulfillmentText);
            // console.log(response.data.intent.displayName);
            // console.log(response.data.parameters.fields);
            ctx.setDfData(response.data);
            ctx.setFeedback(response.data.fulfillmentText);
          } catch (error) {
            console.error(error);
          }
        };

        // detects greetings
        if (
          flag === 0 &&
          event.results[event.results.length - 1].isFinal === true &&
          GREETINGS_REGEX.test(transcript)
        ) {
          setFlag(1);
          setCurrSentence(transcript);
          setMicIsActive();
          flagRef.current = true;
          sendToDF();
        }

        if (
          flag === 1 &&
          event.results[event.results.length - 1].isFinal === true
        ) {
          if (props.isInfoDialog) {
            if (DIALOG_REGEX_CONFIRM.test(transcript)) {
              props.setInfoDialog(false);
            }
          }

          // checks for confirmation in the payment dialog
          if (props.isPaymentDialog && ctx.items.length > 0) {
            if (DIALOG_REGEX_CONFIRM.test(transcript)) {
              props.setDecision(1);
            } else if (DIALOG_REGEX_DECLINE.test(transcript)) {
              props.setDecision(2);
            }
          }

          //scrolling
          else if (MORE_SCROLL_REGEX.test(transcript)) {
            props.setScroll(true);
          } else if (SCROLL_DOWN_REGEX.test(transcript)) {
            props.setScrollState(true);
            props.setScroll(true);
          } else if (SCROLL_UP_REGEX.test(transcript)) {
            props.setScrollState(false);
            props.setScroll(true);
          }

          // checks for screen to set and payment dialog
          else if (MENU_REGEX.test(transcript)) {
            props.setScreenState(1);
          } else if (CLEAR_REGEX.test(transcript)) {
            clearItems();
          } else if (CART_REGEX.test(transcript)) {
            props.setScreenState(2);
          } else if (PAYMENT_REGEX.test(transcript)) {
            props.setPaymentDialog(true);
          } else if (ASSISTANCE_REGEX.test(transcript)) {
            props.setAssistDialog(true);
          } else if (HELP_REGEX.test(transcript)) {
            props.setInfoDialog(true);
          }

          // DialogFlow
          else {
            if (!flagRef.current) {
              flagRef.current = true;
              sendToDF();
            }
          }

          addToSentenceArray(transcript);
          setCurrSentence(transcript);
        }
      });
    }
  }, [
    addToSentenceArray,
    flag,
    props,
    setCurrSentence,
    setFlag,
    setMicIsActive,
  ]);
};

export default SpeechRecognition;
