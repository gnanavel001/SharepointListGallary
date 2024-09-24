import * as React from 'react';
import { SyntheticEvent } from "react";
import styles from './Dlaccrodian.module.scss';

function Accordian({
  title,
  isOpen,
  onToggle,
  children,
  isParent,
}: Readonly<{
  title: string;
  isOpen: boolean;
  onToggle: (e: SyntheticEvent<HTMLDetailsElement>) => void;
  children: React.ReactNode;
  isParent: boolean;
}>) {
  const titleToDisplay = title.charAt(0).toUpperCase() + title.substring(1);

  return (
    <details
      open={isOpen}
      onToggle={onToggle}
    >
      <summary
        className={`${isOpen ? styles.open : ""}${isParent ? styles['parent-summary'] : "child-summary"
          }`}
      >
        <div className={styles['summary-title']}>
          {!isParent ? <p>-</p> : null}
          <h3 className={styles["parent-title"]}>{titleToDisplay}</h3>
        </div>
        <img
          src={require('../assets/caret-down.svg')}
          width={20}
          height={20}
          alt="Caret down"
          style={{ transform: !isOpen ? "rotate(-90deg)" : "" }}
        />
      </summary>
      {children}
    </details>
  );
}

export default Accordian;