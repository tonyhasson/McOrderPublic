import React, { useState } from 'react';
import styles from './EndlessLoop.module.css';

const EndlessLoop = () => {
  return (
    <div className={styles.container}>
      <div className={styles.word}>
        <h5>"What can i order?"</h5>
        <h5>"Show me my cart please"</h5>
        <h5>"Whats' on the menu?"</h5>
        <h5>"I want a burger"</h5>
        <h5>"I would like to finish my order please.."</h5>
        <h5>"delete my cart please"</h5>
        <h5>"Show me my order.."</h5>
        <h5>"I want a large coca-cola please"</h5>
      </div>
    </div>
  );
};

export default EndlessLoop;
