import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        ...props.style,
      }}
    />
  );
}
