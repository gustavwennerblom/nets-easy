import { useEffect } from 'react';

export const useDibsCheckout = (paymentId, history) => {
  const defaultCheckoutOptions = {
    checkoutKey: process.env.REACT_APP_CHECKOUT_KEY,
    language: 'sv-SE',
    containerId: 'dibs-complete-checkout',
  };

  useEffect(() => {
    if (paymentId) {
      // eslint-disable-next-line no-undef
      const checkout = new Dibs.Checkout({
        ...defaultCheckoutOptions,
        paymentId: paymentId,
      });

      // checkout.on('pay-initialized', (response) => {
      //   console.log('checkout on pay-initialized called');
      // });

      checkout.on('payment-completed', (response) => {
        console.log('checkout on payment-completed called');
        // Response: paymentId: string (GUID without dashes)
        history.push('/thankyou', { paymentId: response.paymentId });
      });
    }
  });
};
