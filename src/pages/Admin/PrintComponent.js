import React from 'react';
import BillPreview from './BillPreview';
import "../AdminCss/PrintComponent.css"


const PrintComponent = ({ order }) => {
  return (
    <div>
      <BillPreview order={order} />
    </div>
  );
};

export default PrintComponent;
