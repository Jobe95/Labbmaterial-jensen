import React, { useState } from 'react';
import styles from './SegmentedToggle.module.scss';

type Props = {
  onChanged: (value: boolean) => void;
};

export const SegmentedToggle = ({ onChanged }: Props) => {
  const [state, setState] = useState(true);

  const handleToggle = (value: boolean) => {
    setState(value);
    onChanged(value);
  };
  return (
    <div className={styles.segmentedContainer}>
      <div
        className={`${styles.item} ${state ? styles.active : styles.inactive}`}
        onClick={() => handleToggle(true)}
      >
        Logga in
      </div>
      <div
        className={`${styles.item} ${state ? styles.inactive : styles.active}`}
        onClick={() => handleToggle(false)}
      >
        Registrera dig
      </div>
    </div>
  );
};
