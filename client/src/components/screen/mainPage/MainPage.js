import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import classes from "./MainPage.module.css";
import MicIcon from "@mui/icons-material/Mic";
import CartContext from "../../../store/cart-context";
import axios from "axios";
import EndlessLoop from "./EndlessLoop";

const MainPage = (props) => {
  const ctx = useContext(CartContext);
  const [isRecording, setIsRecording] = useState(false);
  const [micState, setMicState] = useState(classes.mic);
  const [mainState, setMainState] = useState(classes.main);
  const isFirstRender = useRef(true);
  var flagRef = useRef(false);

  //changes microphone to red on speech
  const startRecording = useCallback(() => {
    setIsRecording(!isRecording);
    setMicState(isRecording ? classes.mic : `${classes.mic} ${classes.active}`);
  }, [isRecording]);

  //changes microphone to red on click
  const clickedRecording = () => {
    setIsRecording(!isRecording);
    setMicState(isRecording ? classes.mic : `${classes.mic} ${classes.active}`);
    ctx.setMicIsActive();
  };

  //init of the system
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    if (props.screenState !== 0) {
      setMainState(`${classes.main} ${classes.disappear}`);
    } else {
      setMainState(classes.main);
    }
    if (ctx.flag === 1) {
      startRecording();
    }
  }, [props.screenState, ctx.flag]);

  // ----------------------

  // changing mic state when tts talks
  useEffect(() => {
    if (ctx.flag === 1) {
      flagRef.current = props.audioPlayerState;
      clickedRecording();
    }
  }, [ctx.flag, props.audioPlayerState]);

  // fetch -> get uid and items on reload
  useEffect(() => {
    const getUid = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getUid");
        ctx.setUid(response.data[0].user_id);
      } catch (error) {
        console.log(error);
      }
    };

    const getItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getItems");
        ctx.recoverItems(response.data[0].order_details.items);
      } catch (error) {
        console.log(error);
      }
    };

    getUid();
    props.setIsPaymentDone(false);
    getItems();
  }, []);
  //--------------------------------------

  return (
    <div className={mainState}>
      <div className={classes.content}>
        {ctx.sentence === null && (
          <h1 className={classes.headline}>Would you like to order?</h1>
        )}
        {ctx.sentence === null && (
          <h3 className={classes.subheadline}>
            Please say "Hello McDonald's" or "Hi McDonald's" to begin...
          </h3>
        )}
        {ctx.sentence !== null && (
          <h1 className={classes.headline}>{ctx.sentence}</h1>
        )}
        {ctx.feedback !== "" && (
          <h2 className={classes.feedBack}>{ctx.feedBack}</h2>
        )}
      </div>
      <div className={classes.micBox}>
        <MicIcon
          className={isFirstRender.current ? classes.micFirst : micState}
          onClick={clickedRecording}
        />
      </div>
    </div>
  );
};

export default MainPage;
