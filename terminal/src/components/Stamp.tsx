import React from 'react';
import { MdCoffee, MdLiquor } from 'react-icons/md';
import { StampType } from '../types/graphql-global';
import './Stamp.scss';

function isNumeric(n: any): n is number | string {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default function Stamp(props: { value: number | string; type: StampType }) {
  let value = isNumeric(props.value) ? (props.value > 0 ? '+' + props.value : props.value.toString()) : props.value;
  let icon = props.type === StampType.BOTTLE ? <MdLiquor /> : <MdCoffee />;

  return (
    <div className="stamp">
      <span>{value}</span>
      {icon}
    </div>
  );
}
