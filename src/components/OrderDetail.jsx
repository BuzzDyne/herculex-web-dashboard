import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { order_id } = useParams();

  // Fetch order details based on the order_id parameter

  return (
    <div>
      <h2>Order Detail</h2>
      <p>Order ID: {order_id}</p>
      {/* Display the fetched order details here */}
    </div>
  );
};

export default OrderDetail;