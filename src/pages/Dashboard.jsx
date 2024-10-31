import React from "react";
import map from "../../src/assets/images/map_1.png";
import data from "../data.js";

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

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <div>
          {" "}
          <img src={map} alt="" />
        </div>
        <div>
          {" "}
          <img src={map} alt="" />
        </div>
        <div>
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                    <thead class="border-b border-neutral-200 font-medium dark:border-white/10 text-black">
                      <tr>
                        <th scope="col" class="px-6 py-4">
                          #
                        </th>
                        <th scope="col" class="px-6 py-4">
                          First
                        </th>
                        <th scope="col" class="px-6 py-4">
                          Last
                        </th>
                        <th scope="col" class="px-6 py-4">
                          Handle
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-black">
                      <tr class="border-b border-neutral-200 dark:border-white/10">
                        <td class="whitespace-nowrap px-6 py-4 font-medium">
                          1
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">Mark</td>
                        <td class="whitespace-nowrap px-6 py-4">Otto</td>
                        <td class="whitespace-nowrap px-6 py-4">@mdo</td>
                      </tr>
                      <tr class="border-b border-neutral-200 dark:border-white/10">
                        <td class="whitespace-nowrap px-6 py-4 font-medium">
                          2
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">Jacob</td>
                        <td class="whitespace-nowrap px-6 py-4">Thornton</td>
                        <td class="whitespace-nowrap px-6 py-4">@fat</td>
                      </tr>
                      <tr class="border-b border-neutral-200 dark:border-white/10">
                        <td class="whitespace-nowrap px-6 py-4 font-medium">
                          3
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">Larry</td>
                        <td class="whitespace-nowrap px-6 py-4">Wild</td>
                        <td class="whitespace-nowrap px-6 py-4">@twitter</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 ">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Orders</h1>
            <button className="text-blue-500">See All</button>
          </div>
          <div className="flex space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded">
              Ongoing
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded">
              Next 5 Days
            </button>
          </div>
          <div className="mt-4 max-h-40 overflow-y-auto ">
            {" "}
            {data.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
