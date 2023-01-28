import classes from './Header.module.css';
import mcLogo from '../../mcdonalds3.png';
import SpeechRecognition from './SpeechRecognition';
import AudioPlayer from '../tts/AudioPlayer';

const Header = (props) => {
  const showCart = () => {
    props.setScreenState(2);
  };

  const showMenu = () => {
    props.setScreenState(1);
  };

  return (
    <div className={classes.header}>
      <div className={classes.logoBox}>
        <img className={classes.logo} src={mcLogo} alt="logo"></img>
      </div>
      <h1 className={classes.title}>McOrder</h1>
      <div className={classes.buttonBox}>
        {props.screenState !== 2 && (
          <button className={classes.button} onClick={showCart}>
            Cart
          </button>
        )}
        {props.screenState === 2 && (
          <button className={classes.buttonActive} onClick={showCart}>
            Cart
          </button>
        )}
        {props.screenState !== 1 && (
          <button className={classes.button} onClick={showMenu}>
            Menu
          </button>
        )}
        {props.screenState === 1 && (
          <button className={classes.buttonActive} onClick={showMenu}>
            Menu
          </button>
        )}
        <AudioPlayer
          audioPlayerState={props.audioPlayerState}
          isPaymentDone={props.isPaymentDone}
          isInfoDialog={props.isInfoDialog}
          isAssistDialog={props.isAssistDialog}
          setAudioPlayerState={props.setAudioPlayerState}
          setIsPaymentDone={props.setIsPaymentDone}
        />
        <SpeechRecognition
          screenState={props.screenState}
          isPaymentDialog={props.isPaymentDialog}
          isPaymentDone={props.isPaymentDone}
          isInfoDialog={props.isInfoDialog}
          isAssistDialog={props.isAssistDialog}
          isPaying={props.isPaying}
          decision={props.decision}
          scrollAgain={props.scrollAgain}
          audioPlayerState={props.audioPlayerState}
          // -----------
          setScreenState={props.setScreenState}
          setAssistDialog={props.setAssistDialog}
          setInfoDialog={props.setInfoDialog}
          setPaymentDialog={props.setPaymentDialog}
          setIsPaymentDone={props.setIsPaymentDone}
          setDecision={props.setDecision}
          setScrollState={props.setScrollState}
          setScrollAgain={props.setScrollAgain}
          setScroll={props.setScroll}
          setAudioPlayerState={props.setAudioPlayerState}
        />
      </div>
    </div>
  );
};

export default Header;
