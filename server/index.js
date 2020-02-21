const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { config } = require('./klarna-config');

dotenv.config();

const server = express();
const jsonParser = bodyParser.json();

if (process.env.NODE_ENV !== 'production') server.use(cors());

// https://tech.dibspayment.com/easy/integration-guide

server.post('/api/nets/checkout', jsonParser, async (req, res) => {
  // const order = req.body;
  const testOrder = {
    order: {
      items: [
        {
          reference: '13',
          name: 'testproduct 1',
          quantity: 2,
          unit: 'pcs',
          unitPrice: 48648,
          taxRate: 2500,
          taxAmount: 24324,
          grossTotalAmount: 121620,
          netTotalAmount: 97296,
        },
        {
          reference: '21',
          name: 'testproduct 2',
          quantity: 2,
          unit: 'kg',
          unitPrice: 111840,
          taxRate: 2500,
          taxAmount: 55920,
          grossTotalAmount: 279600,
          netTotalAmount: 223680,
        },
      ],
      amount: 401220,
      currency: 'sek',
      reference: 'Demo Order',
    },
    checkout: {
      url: 'http://localhost:3000',
      termsUrl: 'https://localhost:3000/toc',
      consumerType: {
        supportedTypes: ['B2C', 'B2B'],
        default: 'B2B',
      },
    },
  };

  const paymentId_raw = await fetch(
    'https://test.api.dibspayment.eu/v1/payments',
    {
      method: 'POST',
      body: JSON.stringify(testOrder),
      headers: {
        Authorization: process.env.NETS_SECRET_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  // console.log(paymentId_raw);

  const paymentId = await paymentId_raw.json();

  console.log(paymentId);
  res.send(paymentId);
});

// Reference: https://developers.klarna.com/api/#checkout-api-create-a-new-order
// and https://developers.klarna.com/documentation/klarna-checkout/integration-guide/render-the-checkout/
server.post('/api/klarna/checkout', async (req, res) => {
  const authString = Buffer.from(
    `${process.env.KLARNA_UID}:${process.env.KLARNA_PASSWORD}`
  ).toString('base64');
  console.log(authString);

  const klarnaResultStream = await fetch(
    `${process.env.KLARNA_BASE_URL}/checkout/v3/orders`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchase_country: config.country,
        purchase_currency: config.currency,
        locale: config.language,
        order_amount: 50000,
        order_tax_amount: 10000,
        order_lines: [
          {
            type: 'digital',
            reference: '19-402-SWE',
            name: 'Camera Travel Set',
            quantity: 1,
            quantity_unit: 'pcs',
            unit_price: 50000,
            tax_rate: 2500,
            total_amount: 50000,
            total_discount_amount: 0,
            total_tax_amount: 10000,
            // image_url: 'http://merchant.com/logo.png',
          },
        ],
        merchant_urls: {
          terms: `http://localhost:3000/toc`,
          checkout: 'http://localhost:3000',
          confirmation: 'http://localhost:3000/thankyou',
          push: 'http://localhost:5000/api/klarna/push',
        },
      }),
    }
  );

  const klarnaResult = await klarnaResultStream.json();

  res.send(klarnaResult);
});

server.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, '/../build', 'index.html'));
});

server.listen(process.env.SERVER_PORT, () =>
  console.log(`server listening on ${process.env.SERVER_PORT}`)
);
