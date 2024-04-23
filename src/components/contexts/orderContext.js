// OrderContext.js

import React, { createContext, useContext, useState } from 'react';

const orderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const updateOrderStatus = (orderId, status) => {
    // Update the status of the order in the local state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: status } : order
      )
    );
  };

  return (
    <orderContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </orderContext.Provider>
  );
};

export const useOrderContext = () => {
  return useContext(orderContext);
};
