import React, { useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import Map from "../../../components/Map/map";

const Route = () => {
  const [componentVariant, setComponentVariant] = useState("filled");

  const onFormVariantChange = (changedValues) => {
    if (changedValues.variant) {
      setComponentVariant(changedValues.variant);
    }
  };
  return (
    <div className=" ">
      <div className="flex h-screen justify-between gap-4  bg-gray-100 p-4">
        <div className="w-full md:w-2/3  bg-white shadow-lg rounded-lg">
          <Map />
        </div>
        <div className="w-1/3">
          <Form
            onValuesChange={onFormVariantChange}
            initialValues={{ variant: componentVariant }}
            className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg "
          >
            <h2 className="text-center text-xl ">Create route</h2>
            <Form.Item
              label={<span className="font-medium text-sm">Start</span>}
              name="Start"
              rules={[{ required: true, message: "Please input!" }]}
              className="flex flex-col"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium text-sm">End </span>}
              name="End "
              rules={[{ required: true, message: "Please input!" }]}
              className="flex flex-col"
            >
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-sm">Route</span>}
              name="Route"
              rules={[{ required: true, message: "Please input!" }]}
              className="flex flex-col"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium text-sm">Date</span>}
              name="Date"
              rules={[{ required: true, message: "Please select a date!" }]}
              className="flex flex-col"
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item className="flex flex-col items-center ">
              <Button type="primary" htmlType="submit" className="w-full">
                Create route
              </Button>
            </Form.Item>
            <Form.Item
              label={<span className="font-medium text-sm">Location</span>}
              name="Location"
              className="flex flex-col"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-2  p-4 bg-gray-100">
        <h2 className="text-slate-950 text-lg">Total Route</h2>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Route
              </th>
              <th scope="col" class="px-6 py-3">
                Start
              </th>
              <th scope="col" class="px-6 py-3">
                End
              </th>
              <th scope="col" class="px-6 py-3">
                Time
              </th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Route 1
              </th>
              <td class="px-6 py-4">Đà nẵng</td>
              <td class="px-6 py-4">Huế</td>
              <td class="px-6 py-4">7:00:00</td>
              <td class="px-6 py-4 text-right">
                <a
                  href="#"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Route 2
              </th>
              <td class="px-6 py-4">Quảng Nam</td>
              <td class="px-6 py-4">Huế</td>
              <td class="px-6 py-4">8:00:00</td>
              <td class="px-6 py-4 text-right">
                <a
                  href="#"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Route;
