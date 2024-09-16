import * as React from 'react';
import { SyntheticEvent } from "react";

function Accordian({
  title,
  isOpen,
  onToggle,
  children,
}: Readonly<{
  title: string;
  isOpen: boolean;
  onToggle: (e: SyntheticEvent<HTMLDetailsElement>) => void;
  children: React.ReactNode;
}>) {
  const titleToDisplay = title.charAt(0).toUpperCase() + title.substring(1);

  return (
    <details open={isOpen} onToggle={onToggle}>
      <summary className={`${isOpen ? "open" : "closed"}`}>
        <p>{titleToDisplay}</p>
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
