import React, { useRef, useContext, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import classes from './Background.module.css';
import Loader from './Loader'; // import the loader component
import CartContext from '../../../store/cart-context';
import MicIcon from '@mui/icons-material/Mic';
import BGvideo from '../../../BGVideo.mp4';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EndlessLoop from '../mainPage/EndlessLoop';

export default function Background(props) {
  const ctx = useContext(CartContext);
  const box = useRef();
  const flagRef = useRef(false);

  // changes the mic state
  const startRecording = () => {
    ctx.setMicIsActive();
  };

  let micState = !ctx.micActive
    ? classes.Mic
    : `${classes.Mic} ${classes.active}`;

  // ---------------------

  // changes the minimized bg or the full bg
  let backVidState = null;

  if (props.screenState !== 0) {
    backVidState = classes.minimizedOpen;
    setTimeout(() => {
      box.current.classList.add(classes.mini);
    }, 800);
  } else {
    backVidState = !ctx.micActive
      ? classes.backVid
      : `${classes.backVid} ${classes.active}`;
  }
  // ------------------------------------------

  // items counter
  let itemsCount = 0;

  ctx.items.forEach((item) => {
    itemsCount = itemsCount + item.amount;
  });

  // switch mic's color when flag is set to 1 and audio is on or off
  useEffect(() => {
    if (ctx.flag === 1) {
      flagRef.current = props.audioPlayerState;
      ctx.setMicIsActive();
    }
  }, [ctx.flag, props.audioPlayerState]);

  // item count animation
  const { scale } = useSpring({
    to: { scale: itemsCount > 0 ? 1.1 : 1 },
    from: { scale: 0.95 },
    config: { duration: 200 },
    reset: itemsCount > 0,
  });

  return (
    <div className={classes.box} ref={box}>
      {!props.videoLoaded && <Loader />}
      <video
        className={backVidState}
        src={BGvideo}
        autoPlay
        loop
        muted
        onLoadedData={props.onVideoLoaded} // call the onVideoLoaded function once the video is loaded
      />
      {props.screenState !== 0 && (
        <div className={classes.Header}>
          <MicIcon className={micState} onClick={startRecording} />
          {ctx.sentence && !props.audioPlayerState && (
            <h2 className={classes.HeaderText}>{ctx.sentence}</h2>
          )}
          {ctx.feedback !== '' && props.audioPlayerState && (
            <h2 className={classes.feedBack}>{ctx.feedBack}</h2>
          )}

          <div className={classes.BasketContent}>
            <ShoppingBasketIcon className={classes.Basket} />
            <animated.span
              className={classes.BasketItems}
              style={{
                transform: scale.to((s) => `scale(${s})`),
              }}
            >
              {itemsCount}
            </animated.span>
          </div>
        </div>
      )}
      <div className={classes.endlessLoop}>
        {props.screenState === 0 && <EndlessLoop />}
      </div>
    </div>
  );
}
