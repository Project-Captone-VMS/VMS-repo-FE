import React, { useState } from "react";
import { Button, Input, Modal } from "antd";
import Map from "../../../components/Map/map";

const Route = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      route: "Route 1",
      start: "Đà Nẵng",
      end: "Huế",
      time: "7:00:00",
      estimateTime: "10",
    },
    {
      id: 2,
      route: "Route 2",
      start: "Quảng Nam",
      end: "Huế",
      time: "8:00:00",
      estimateTime: "10",
    },
  ]);

  const [formData, setFormData] = useState({
    route: "",
    start: "",
    end: "",
    estimateTime: "",
    location: "",
  });

  const [editData, setEditData] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoute = {
      id: routes.length + 1,
      route: formData.route,
      start: formData.start,
      end: formData.end,
      estimateTime: formData.estimateTime,
      time: new Date(formData.date).toLocaleTimeString(),
    };
    setRoutes([...routes, newRoute]);
    setFormData({
      route: "",
      start: "",
      end: "",
      estimateTime: "",
      location: "",
    }); 
  };

  const handleEdit = (route) => {
    setEditData(route);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === editData.id ? { ...editData } : route
      )
    );
    setIsModalVisible(false);
  };

  return (
    <div className="">
      <div className="flex h-screen justify-between gap-4 bg-gray-100 p-4">
        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg">
          <Map />
        </div>
        <div className="w-1/3">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
          >
            <h2 className="text-center text-xl">Create Route</h2>
            <div className="flex flex-col mb-4">
              <label htmlFor="start" className="font-medium text-sm">
                Start
              </label>
              <Input
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                placeholder="Enter start location"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="end" className="font-medium text-sm">
                End
              </label>
              <Input
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                placeholder="Enter end location"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="route" className="font-medium text-sm">
                Route
              </label>
              <Input
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="Enter route name"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="date" className="font-medium text-sm">
                Estimate Time
              </label>
              <Input
                id="estimate Time"
                type="text"
                name="estimateTime"
                value={formData.estimateTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-center">
              <Button type="primary" htmlType="submit" className="w-full">
                Create Route
              </Button>
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="location" className="font-medium text-sm">
                Location
              </label>
              <textarea
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                rows={4}
                className="border rounded p-2"
                placeholder="Enter location details"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2 p-4 bg-gray-100">
        <h2 className="text-slate-950 text-lg">Total Route</h2>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Route
              </th>
              <th scope="col" className="px-6 py-3">
                Start
              </th>
              <th scope="col" className="px-6 py-3">
                End
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Estimate Time
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr
                key={route.id}
                className="bg-white border-b dark:bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black "
                >
                  {route.route}
                </th>
                <td className="px-6 py-4">{route.start}</td>
                <td className="px-6 py-4">{route.end}</td>
                <td className="px-6 py-4">{route.time}</td>
                <td className="px-6 py-4 ">{route.estimateTime}</td>
                <td className="px-6 py-4 text-right">
                  <Button type="link" onClick={() => handleEdit(route)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Edit Route"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="editRoute" className="font-medium text-sm">
            Route
          </label>
          <Input
            id="editRoute"
            name="route"
            value={editData?.route || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editStart" className="font-medium text-sm">
            Start
          </label>
          <Input
            id="editStart"
            name="start"
            value={editData?.start || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editEnd" className="font-medium text-sm">
            End
          </label>
          <Input
            id="editEnd"
            name="end"
            value={editData?.end || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editEstimateTime" className="font-medium text-sm">
            End
          </label>
          <Input
            id="editEstimateTime"
            name="estimateTime"
            value={editData?.estimateTime || ""}
            onChange={handleEditChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Route;
