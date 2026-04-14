import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 10,
        border: '1px solid #444',
        background: '#111',
        color: '#fff',
        fontSize: 16,
        ...props.style,
      }}
    />
  );
}
