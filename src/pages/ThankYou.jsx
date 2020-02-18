import React from 'react';
import { useLocation } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const { paymentId } = location.state;

  return (
    <div>{`Thank you for your payment with id ${paymentId}`}</div>
  )
};

export default ThankYou;