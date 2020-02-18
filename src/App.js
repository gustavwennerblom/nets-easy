import React from 'react';
import './App.css';



function App() {

  const createPayment = async () => {
    const res = await fetch('http://localhost:5000/checkout/getid', { method: 'POST'});
    const { paymentId } = await res.json()
    console.log('PaymentId is ', paymentId);
    // eslint-disable-next-line no-undef
    
    console.log('checkoutKey', process.env.REACT_APP_CHECKOUT_KEY);
    const checkoutOptions = {
      checkoutKey: process.env.REACT_APP_CHECKOUT_KEY,
      paymentId: paymentId,
      theme: { textColor: "blue" }
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
      <header className="App-header">
        {/* Add entry point for DIBS checkout */}
        <div id="dibs-complete-checkout" />
        <button id="CreatePayment" onClick={createPayment}>Pay for stuff</button>

        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
