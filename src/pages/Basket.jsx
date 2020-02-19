import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const Basket = () => {
    const history = useHistory();
    // const [checkout, setCheckout] = useState();
    
    // eslint-disable-next-line no-undef
    // window.checkout1 = new Dibs.Checkout();

    const createPayment = async () => {
        const res = await fetch('http://localhost:5000/api/checkout/getid', { method: 'POST'});
        const { paymentId } = await res.json()
        console.log('PaymentId is ', paymentId);
        
        console.log('checkoutKey', process.env.REACT_APP_CHECKOUT_KEY);
        const checkoutOptions = {
          checkoutKey: process.env.REACT_APP_CHECKOUT_KEY,
          paymentId: paymentId,
          language: 'sv-SE',
          containerId:'dibs-complete-checkout',
        };
    
        // eslint-disable-next-line no-undef
        globalShop.checkout = new Dibs.Checkout(checkoutOptions);
      }

    // eslint-disable-next-line no-undef
    globalShop.checkout && globalShop.checkout.on('payment-completed', (response) => {
      console.log('checkout on payment-completed called');
      // Response: paymentId: string (GUID without dashes)
      history.push('/thankyou', { paymentId: response.paymentId });
      // setCheckout(checkout);
    });

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