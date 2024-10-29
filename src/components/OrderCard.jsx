import React from "react";


const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{order.id}</h2>
        <span className="text-white bg-purple-600 px-3 py-1 rounded-full">
          {order.status}
        </span>
      </div>
      <div className="mt-2">
        <p className="bg-gray-200 inline-block px-3 py-1 rounded-md text-sm mb-1">
          Due Date: {order.dueDate}
        </p>
        <p className="font-semibold">Customer: {order.customerName}</p>
        <p>Contact Detail: {order.contactDetail}</p>
        <p>Car Model: {order.carModel}</p>
        <p>Registration Number: {order.registrationNumber}</p>
      </div>
    </div>
  );
};

export default OrderCard;
