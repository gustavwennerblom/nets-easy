const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

dotenv.config();

const server = express();
const jsonParser = bodyParser.json();


if (process.env.NODE_ENV !== 'production') server.use(cors());

// https://tech.dibspayment.com/easy/integration-guide

server.post('/checkout/getid', jsonParser, async (req, res) => {
  // const order = req.body;
  const testOrder = {
    order: {
      items: [{
            "reference": "13",
            "name": "testproduct 1",
            "quantity": 2,
            "unit": "pcs",
            "unitPrice": 48648,
            "taxRate": 2500,
            "taxAmount": 24324,
            "grossTotalAmount": 121620,
            "netTotalAmount": 97296
        },
        {
            "reference": "21",
            "name": "testproduct 2",
            "quantity": 2,
            "unit": "kg",
            "unitPrice": 111840,
            "taxRate": 2500,
            "taxAmount": 55920,
            "grossTotalAmount": 279600,
            "netTotalAmount": 223680
        }
        ],
        amount: 401220,
        currency: "sek",
        reference: "Demo Order"
        },
      checkout: {
      integrationType: "EmbeddedCheckout",
      url: "http://localhost:3000/checkout",
      termsUrl: "https://localhost:3000/toc",
      shippingCountries:
        [
            {"countryCode": "SWE"},
            {"countryCode": "NOR"}
        ],
        consumerType: {
            "supportedTypes": [ "B2C", "B2B" ],
            "default": "B2C"
        }
    }
  }

  const paymentId_raw = await fetch('https://test.api.dibspayment.eu/v1/payments', { 
    method: 'POST', 
    body: JSON.stringify(testOrder), 
    headers: {
      'Authorization': process.env.NETS_SECRET_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  // console.log(paymentId_raw);

  const paymentId = await paymentId_raw.json();

  console.log(paymentId);
  res.send(paymentId);
});

server.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, '/../build', 'index.html'));
})

server.listen(process.env.SERVER_PORT, () => console.log(`server listening on ${process.env.SERVER_PORT}`));