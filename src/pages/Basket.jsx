import React, { useState } from 'react';
import { Button, Container, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDibsCheckout } from '../hooks/useDibsCheckout';

const Basket = () => {
  const [paymentId, setPaymentId] = useState();

  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const paymentIdFromURL = searchParams.get('paymentId');

  if (paymentIdFromURL && paymentIdFromURL !== paymentId) {
    console.log(`Payment ID ${paymentIdFromURL} incoming in URL`);
    setPaymentId(paymentIdFromURL);
  }

  useDibsCheckout(paymentId, history);

  const createDIBSPayment = async () => {
    const res = await fetch('http://localhost:5000/api/nets/checkout', {
      method: 'POST',
    });
    const { paymentId: newPaymentId } = await res.json();
    console.log('New payment with created with id ', newPaymentId);
    setPaymentId(newPaymentId);
  };

  const createKlarnaPayment = async () => {
    const res = await global.fetch(
      'http://localhost:5000/api/klarna/checkout',
      {
        method: 'POST',
      }
    );
    const resJson = await res.json();
    console.log(resJson);
  };

  return (
    <Container className="Basket">
      <h1>DIBS Easy demo</h1>
      <Button variant="contained" color="primary" onClick={createDIBSPayment}>
        Pay for stuff with Nets
      </Button>
      <Button variant="contained" color="primary" onClick={createKlarnaPayment}>
        Pay for stuff with Klarna
      </Button>

      {/* Add entry point for DIBS checkout */}
      <div id="dibs-complete-checkout" />
    </Container>
  );
};

export default Basket;
