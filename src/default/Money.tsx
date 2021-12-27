import React from 'react';

export function moneyToString(value: number): string {
  return (value / 100).toFixed(2).replace('.', ',') + ' €';
}

export default function Money(props: { value: number; compact?: boolean }) {
  if (props.compact) {
    let abs = Math.abs(props.value);
    let sign = props.value < 0 ? '-' : '';
    let euro = Math.floor(abs / 100).toString();
    let cent = (abs % 100).toString().padStart(2, '0');
    return (
      <span>
        {sign + euro}
        <sup>{cent}</sup>
      </span>
    );
  }

  return <span>{moneyToString(props.value)}</span>;
}
