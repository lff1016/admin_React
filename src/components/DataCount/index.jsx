import React from 'react';

import './index.css'

export default function DataCount({name, count}) {
  return (
    <div className='card data-item'>
      <div className='data-count-title'>{name}</div>
      <div className='data-count'>{count}</div>
    </div>
  )
}
