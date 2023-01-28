import { useState, useRef, useEffect, useContext } from 'react';
import makeSound from './tts';
import CartContext from '../../store/cart-context';
import whistle from '../../whistle.mp3';

const AudioPlayer = (props) => {
  const { setAudioPlayerState } = props;
  const ctx = useContext(CartContext);
  const { feedBack } = ctx;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    makeSound(feedBack).then((res) => setSound(res));
  }, [feedBack]);

  useEffect(() => {
    if (isPlaying) {
      setAudioPlayerState(true);
    } else {
      setAudioPlayerState(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    const helpPrompt =
      "welcome to McDonald's ,please take a moment to read through these instructions on using our McOrder system. If you have any questions or need additional help, simply ask for an employee,and a worker will assist you.";
    if (props.isInfoDialog) {
      makeSound(helpPrompt).then((res) => setSound(res));
    }
  }, [props.isInfoDialog]);

  useEffect(() => {
    if (props.isPaymentDone) {
      setSound(whistle);
    }
  }, [props.isPaymentDone]);

  const ClearCurrentOrder = async () => {
    try {
      await fetch('http://localhost:5000/delete/CurrentOrder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const incUid = () => {
    try {
      fetch('http://localhost:5000/updateUid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          $inc: {
            user_id: 1,
          },
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const assistPrompt =
      "Don't worry, you're not alone! Our McHelp team has received your request for assistance and a friendly employee will be with you shortly to help you out. Thanks for your patience!";
    if (props.isAssistDialog) {
      makeSound(assistPrompt).then((res) => setSound(res));
      setTimeout(() => {
        ClearCurrentOrder();

        // app refresh
        window.location.reload();

        // increament uId
        incUid();
      }, 17000);
    }
  }, [props.isAssistDialog]);

  return (
    <audio
      ref={audioRef}
      // controls
      src={sound}
      autoPlay
      id="audio"
      onPlay={() => setIsPlaying(true)}
      onEnded={() => setIsPlaying(false)}
    />
  );
};

export const play = (audioRef) => {
  audioRef.current.play();
};

export default AudioPlayer;
