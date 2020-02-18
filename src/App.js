import React from 'react';
import './App.css';



function App() {

  const createPayment = async () => {
    const res = await fetch('http://localhost:5000/checkout/getid', { method: 'POST'});
    const { paymentId } = await res.json()
    console.log('PaymentId is ', paymentId);
    
    console.log('checkoutKey', process.env.REACT_APP_CHECKOUT_KEY);
    const checkoutOptions = {
      checkoutKey: process.env.REACT_APP_CHECKOUT_KEY,
      paymentId: paymentId,
      containerId:'dibs-complete-checkout',
    };

    // eslint-disable-next-line no-undef
    const checkout = new Dibs.Checkout(checkoutOptions);

    checkout.on('payment-completed', function(response) {
      /*
      Response:
                     paymentId: string (GUID without dashes)
      */
      window.location = '/PaymentSuccessful';
});
  }

  return (
    <div className="App">
      <h1>DIBS Easy demo</h1>
      <button id="CreatePayment" onClick={createPayment}>Pay for stuff</button>
      {/* Add entry point for DIBS checkout */}
      <div id="dibs-complete-checkout" />
    </div>
  );
}

export default App;
