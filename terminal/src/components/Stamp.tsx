import React from 'react';
import { MdCoffee, MdLiquor } from 'react-icons/md';
import { StampType } from '../types/graphql-global';
import './Stamp.scss';

export default function Stamp(props: { value: number; type: StampType }) {
  let value = props.value > 0 ? '+' + props.value : props.value.toString();
  let icon = props.type === StampType.BOTTLE ? <MdLiquor /> : <MdCoffee />;

  return (
    <div className="stamp">
      <span>{value}</span>
      {icon}
    </div>
  );
}
