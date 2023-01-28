import React, { useState } from 'react';
import axios from 'axios';

const OrderTicket = ({ items }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an array of strings with the item name and amount
    const orderDetails = items.map((item) => `${item.title} x${item.amount}`);

    try {
      const response = await axios.post('/send-order-ticket', {
        orderDetails,
        email,
      });
      alert(`Order ticket sent successfully to ${email}`);
    } catch (error) {
      console.error(error);
      alert('Error sending order ticket. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Order Details:
        <ul>
          {items.map((item) => (
            <li key={item.id}>{`${item.title} x${item.amount}`}</li>
          ))}
        </ul>
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Send Order Ticket</button>
    </form>
  );
};

export default OrderTicket;
