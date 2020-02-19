import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDibsCheckout } from '../hooks/useDibsCheckout'

const Basket = () => {
    const [paymentId, setPaymentId] = useState();
    
    const history = useHistory();
    const searchParams = new URLSearchParams(history.location.search)
    const paymentIdFromURL = searchParams.get('paymentId')

    if(paymentIdFromURL && paymentIdFromURL !== paymentId) {
      console.log(`Payment ID ${paymentIdFromURL} incoming in URL`);
      setPaymentId(paymentIdFromURL)
    }

    useDibsCheckout(paymentId, history);

    const createPayment = async () => {
      const res = await fetch('http://localhost:5000/api/checkout/getid', { method: 'POST'});
      const { paymentId: newPaymentId } = await res.json()
      console.log('New payment with created with id ', newPaymentId);
      setPaymentId(newPaymentId);        
    }
    
    return (
      <Container className="Basket">
        <h1>DIBS Easy demo</h1>
        <button id="CreatePayment" onClick={createPayment}>Pay for stuff</button>
        {/* Add entry point for DIBS checkout */}
        <div id="dibs-complete-checkout" />
      </Container>
    );
};

export default Basket;