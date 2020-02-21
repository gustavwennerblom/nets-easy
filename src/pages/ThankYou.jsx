import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const match = useRouteMatch();

  const { paymentId } = location?.state; // Only when using NETS

  return (
    <div>
      {paymentId && `Thank you for your NETS payment with id ${paymentId}`}
    </div>
  );
};

export default ThankYou;
