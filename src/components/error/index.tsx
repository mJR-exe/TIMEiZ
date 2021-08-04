import React from 'react';

import './styles.scss';

type errorProps = {
  error: string;
}

export default function Error(props: errorProps) {
  return (
    <div className="error">
      <div className="icon">Erro</div>
      <div className="message">{props.error}</div>
    </div>
  );
}