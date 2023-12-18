import React, { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import './App.css';
import { toast } from 'react-toastify';

function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const ValidateCardNumber = () => {
    if (validator.isCreditCard(cardNumber)) {
      return true;
    } else {
      return 'Card Number is Invalid';
    }
  };
  const ValidateCardHolderName = () => {
    if (/^[a-zA-Z\s]*$/.test(cardHolderName)) {
      return true;
    } else {
      return 'Card Holder Name is Invalid';
    }
  };
  const ValidateExpiryDate = () => {
    if (/^(0[1-9]|1[0-2])\/(20|22)\d\d$/.test(expiryDate)) {
      return true;
    } else {
      return 'Expiry Date is Invalid';
    }
  };
  const ValidateCvv = () => {
    if (/^\d{3,4}$/.test(cvv)) {
      return true;
    } else {
      return 'CVV is invalid';
    }
  };

  const config = {
    public_key: process.env.REACT_APP_FLWPUBK_TEST,
    tx_ref: Date.now(),
    amount: 1000,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'user@gmail.com',
      phone_number: '08085458405',
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
    },
    customizations: {
      title: 'MarketSparkle',
      description: 'Payment for items in cart',
      logo:
        'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted');
    console.log('Card Number: ', cardNumber);
    console.log('Card Holder Name: ', cardHolderName);
    console.log('Expiry Date: ', expiryDate);
    console.log('CVV: ', cvv);

    const cardNumberValidation = ValidateCardNumber();
    const cardHolderNameValidation = ValidateCardHolderName();
    const expiryDateValidation = ValidateExpiryDate();
    const cvvValidation = ValidateCvv();

    if (
      cardNumberValidation === true &&
      cardHolderNameValidation === true &&
      expiryDateValidation === true &&
      cvvValidation === true
    ) {
      console.log('All inputs are valid');

      try {
        // Make a request to your backend for processing the payment
        const response = await axios.post('https://backend-cmrf.onrender.com/api/payment/make-flutterwave-payment', {
          cardNumber,
          cardHolderName,
          expiryDate,
          cvv,
        });

        console.log('Backend response:', response.data);
        // Handle the response from the backend as needed
      } catch (error) {
        console.error('Error in submitting the form:', error.message);
        alert('Error in submitting the form');
      }
    } else {
      console.log('Errors: ', {
        cardNumberValidation,
        cardHolderNameValidation,
        expiryDateValidation,
        cvvValidation,
      });
      toast('Invalid input. Please check the form fields.');
    }
  };

  return (
    <div className="App">
      <div className="PaymentGateway">
        <h2>Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Card Number
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </label>
          <label>
            Card Holder Name
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required
            />
          </label>
          <label>
            Expiry Date
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </label>
          <label>
            CVV
            <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
          </label>
          <button
            type="submit"
            onClick={() => {
              handleFlutterPayment({
                callback: (response) => {
                  console.log(response);
                  closePaymentModal(); // this will close the modal programmatically
                },
                onClose: () => {},
              });
            }}
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;