import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const Basket = () => {
    const history = useHistory();
    const searchParams = new URLSearchParams(history.location.search)
    const paymentIdFromURL = searchParams.get('paymentId')

    const defaultCheckoutOptions = {
      checkoutKey: process.env.REACT_APP_CHECKOUT_KEY,
      language: 'sv-SE',
      containerId:'dibs-complete-checkout',
    };

    useEffect(() => {
      if(paymentIdFromURL) {
        console.log(`Payment ID ${paymentIdFromURL} incoming in URL`);
        // eslint-disable-next-line no-undef
        const checkout = new Dibs.Checkout({...defaultCheckoutOptions, paymentId: paymentIdFromURL});
  
        checkout.on('pay-initialized', (response) => {
          console.log('checkout on pay-initialized called');
        });
  
        checkout.on('payment-completed', (response) => {
          console.log('checkout on payment-completed called');
          // Response: paymentId: string (GUID without dashes)
          history.push('/thankyou', { paymentId: response.paymentId });
        });
      }
    });
    

    const createPayment = async () => {
        const res = await fetch('http://localhost:5000/api/checkout/getid', { method: 'POST'});
        const { paymentId } = await res.json()
        console.log('PaymentId is ', paymentId);
        
        console.log('checkoutKey', process.env.REACT_APP_CHECKOUT_KEY);
        const checkoutOptions = {
          ...defaultCheckoutOptions,
          paymentId: paymentId,          
        };
    
        // eslint-disable-next-line no-undef
        const checkout = new Dibs.Checkout(checkoutOptions);
    
        checkout.on('payment-completed', (response) => {
          console.log('checkout on payment-completed called');
          // Response: paymentId: string (GUID without dashes)
          history.push('/thankyou', { paymentId: response.paymentId });
          // setCheckout(checkout);
        });
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