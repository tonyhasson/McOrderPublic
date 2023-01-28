import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import classes from './Product.module.css';

const Product = (props) => {
  const [clicked, setClicked] = useState(false);

  const { x } = useSpring({
    from: { x: 0 },
    x: clicked ? 1 : 0,
    config: { duration: 1000 },
  });

  const onClick = () => {
    setClicked((prevState) => !prevState);
    props.onAdd();
  };

  return (
    <div className={classes.productBox} onClick={onClick}>
      <animated.img
        className={classes.productImg}
        src={props.image}
        alt={props.title}
        style={{
          scale: x.to({
            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
            output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
          }),
        }}
      ></animated.img>
      <div className={classes.productContent}>
        <div className={classes.productTitle}>
          <h4>{props.title}</h4>
        </div>
        <div className={classes.productPrice}>
          <h6>{props.price} &#8362;</h6>
        </div>
      </div>
    </div>
  );
};

export default Product;
