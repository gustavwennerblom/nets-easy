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
    // clear any old DIBS content
    document.getElementById('dibs-complete-checkout').innerHTML = '';
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
    const klarnaOrder = await res.json();
    const klarnaHtmlSnippet = klarnaOrder.html_snippet;
    const klarnaContainer = document.getElementById('klarna-checkout');
    klarnaContainer.innerHTML = klarnaHtmlSnippet;
    // Ensure script tags are evaluated
    const scriptTags = klarnaContainer.getElementsByTagName('script');
    for (let tag of scriptTags) {
      const parentNode = tag.parentNode;
      const newTag = document.createElement('script');
      newTag.type = 'text/javascript';
      newTag.text = tag.text;
      parentNode.removeChild(tag);
      parentNode.appendChild(newTag);
    }
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
      <a
        href="https://developers.klarna.com/documentation/testing-environment/"
        target="_blank"
      >
        Klarna test data
      </a>

      {/* Add entry point for DIBS checkout */}
      <div id="dibs-complete-checkout" />
      <div id="klarna-checkout" />
    </Container>
  );
};

export default Basket;
