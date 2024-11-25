import React from "react";
import { MapPin, Truck, Package, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import orders  from "../data.js";
import Map from "../components/Map/map";



const OrderCard = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{order.id}</h2>
        <span className={`text-white px-3 py-1 rounded-full ${order.status === "In Used" ? "bg-green-600" : "bg-purple-600"}`}>
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

const statsData = [
  { name: "Active Vehicles", value: 42, icon: Truck, color: "text-blue-500" },
  { name: "Total Deliveries", value: 1234, icon: Package, color: "text-green-500" },
  { name: "Total Customers", value: 789, icon: Users, color: "text-purple-500" },
  { name: "Revenue", value: "$123,456", icon: TrendingUp, color: "text-yellow-500" },
];

const deliveryData = [
  { name: "Mon", deliveries: 20 },
  { name: "Tue", deliveries: 30 },
  { name: "Wed", deliveries: 25 },
  { name: "Thu", deliveries: 40 },
  { name: "Fri", deliveries: 35 },
  { name: "Sat", deliveries: 15 },
  { name: "Sun", deliveries: 10 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Realtime Tracking Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Live Tracking Map</h2>
          <Map />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deliveries" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            See All
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
