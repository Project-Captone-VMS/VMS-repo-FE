// import React, { useState, useEffect } from "react";
// import { Modal, Input, Select, Button, Form, Table, Space } from "antd";
// import { over } from "stompjs";
// import SockJS from "sockjs-client";
// import useGetAllNotice from "../../hooks/useGetAllNotice";

// const { TextArea } = Input;

// const AdminSender = () => {
//   const showNotification = useGetAllNotice();

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [filterType, setFilterType] = useState("ALL");
//   const [notifications, setNotifications] = useState([]);
//   const [formData, setFormData] = useState({
//     username: "",
//     title: "",
//     content: "",
//     type: "ALERT",
//   });

//   useEffect(() => {
//     const savedNotifications = JSON.parse(
//       localStorage.getItem("notifications")
//     );
//     if (savedNotifications) {
//       setNotifications(savedNotifications);
//     }
//   }, []);

//   useEffect(() => {
//     if (notifications.length > 0) {
//       localStorage.setItem("notifications", JSON.stringify(notifications));
//     }
//   }, [notifications]);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     resetFormData();
//   };

//   const sendNotification = () => {
//     const socket = new SockJS("http://localhost:8080/ws");
//     const stompClient = over(socket);

//     try {
//       stompClient.connect({}, () => {
//         stompClient.send(
//           `/app/chat/${formData.username}`,
//           {},
//           JSON.stringify(formData)
//         );
//         console.log("Notification Sent:", formData);

//         // const newNotification = {
//         //   key: Date.now(),
//         //   username: formData.username,
//         //   title: formData.title,
//         //   content: formData.content,
//         //   type: formData.type,
//         // };

//         setNotifications(showNotification);

//         alert("Thông báo đã được gửi thành công!");
//         resetFormData();
//         setIsModalVisible(false);
//       });
//     } catch (error) {
//       console.error("Error while sending notification:", error);
//     }
//   };

//   const handleInputChange = (key, value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [key]: value,
//     }));
//   };

//   const resetFormData = () => {
//     setFormData({
//       username: "",
//       title: "",
//       content: "",
//       type: "ALERT",
//     });
//   };

//   const showDetailModal = (record) => {
//     Modal.info({
//       title: `Details of Notification to ${record.user.username}`,
//       content: (
//         <div>
//           <p>
//             <strong>Title:</strong> {record.notification.title}
//           </p>
//           <p>
//             <strong>Content:</strong> {record.notification.content}
//           </p>
//           <p>
//             <strong>Type:</strong> {record.notification.type}
//           </p>
//         </div>
//       ),
//     });
//   };

//   const confirmDeleteNotification = (record) => {
//     Modal.confirm({
//       title: "Xác nhận xóa",
//       content: `Bạn chắc chắn xóa thông báo của ${record.user.username} này chứ?`,
//       okText: "Xóa",
//       cancelText: "Hủy",
//       onOk: () => {
//         deleteNotification(record.key);
//       },
//     });
//   };

//   const deleteNotification = (key) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.key !== key)
//     );
//     alert("Thông báo đã được xóa thành công!");
//   };

//   const filteredNotifications =
//     filterType === "ALL"
//       ? notifications
//       : notifications.filter(
//           (notification) => notification.notification.type === filterType
//         );

//   console.log("filteredNotifications", filteredNotifications);
//   return (
//     <div>
//       <div className="flex justify-between px-2 py-4 bg-slate-200 rounded-md mb-4 items-center">
//         <p className="text-2xl font-bold">Notification</p>
//         <div className="flex items-center">
//           <Select
//             placeholder="Select type"
//             style={{ width: 150, marginRight: 20 }}
//             value={filterType}
//             onChange={(value) => setFilterType(value)}
//           >
//             <Select.Option value="ALL">All</Select.Option>
//             <Select.Option value="ALERT">Alert</Select.Option>
//             <Select.Option value="Error">Error</Select.Option>
//           </Select>
//           <Button
//             type="primary"
//             onClick={showModal}
//             className="bg-blue-500 hover:bg-blue-600"
//           >
//             Send Notification
//           </Button>
//         </div>
//       </div>

//       <Modal
//         title="Send Notification"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="cancel" onClick={handleCancel}>
//             Cancel
//           </Button>,
//           <Button key="send" type="primary" onClick={sendNotification}>
//             Send
//           </Button>,
//         ]}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Username" required>
//             <Input
//               placeholder="Enter Username"
//               value={formData.username}
//               onChange={(e) => handleInputChange("username", e.target.value)}
//             />
//           </Form.Item>

//           <Form.Item label="Title" required>
//             <Input
//               placeholder="Enter Title"
//               value={formData.title}
//               onChange={(e) => handleInputChange("title", e.target.value)}
//             />
//           </Form.Item>

//           <Form.Item label="Content" required>
//             <TextArea
//               rows={4}
//               placeholder="Enter Content"
//               value={formData.content}
//               onChange={(e) => handleInputChange("content", e.target.value)}
//             />
//           </Form.Item>

//           <Form.Item label="Type">
//             <Select
//               value={formData.type}
//               onChange={(value) => handleInputChange("type", value)}
//             >
//               <Select.Option value="ALERT">Alert</Select.Option>
//               <Select.Option value="Error">Error</Select.Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Table
//         dataSource={filteredNotifications}
//         rowKey="key"
//         pagination={{ pageSize: 10 }}
//       >
//         <Table.Column
//           title="Username"
//           dataIndex="user.username"
//           key="username"
//         />
//         <Table.Column
//           title="Title"
//           dataIndex={notifications.title}
//           key="title"
//         />
//         <Table.Column title="Type" dataIndex="notification.type" key="type" />
//         <Table.Column
//           title="Content"
//           dataIndex="notification.content"
//           key="content"
//         />
//         <Table.Column
//           title="Action"
//           key="action"
//           render={(_, record) => (
//             <Space size="middle">
//               <Button type="link" onClick={() => showDetailModal(record)}>
//                 Detail
//               </Button>
//               <Button
//                 type="link"
//                 danger
//                 onClick={() => confirmDeleteNotification(record)}
//               >
//                 Delete
//               </Button>
//             </Space>
//           )}
//         />
//       </Table>
//     </div>
//   );
// };

// export default AdminSender;

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Form, Space, Pagination } from "antd";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import useGetAllNotice from "../../components/hooks/useGetAllNotice";

const { TextArea } = Input;

const AdminSender = () => {
  const showNotification = useGetAllNotice();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    title: "",
    content: "",
    type: "ALERT",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormData();
  };

  const sendNotification = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = over(socket);

    try {
      stompClient.connect({}, () => {
        stompClient.send(
          `/app/chat/${formData.username}`,
          {},
          JSON.stringify(formData)
        );
        console.log("Notification Sent:", formData);

        const newNotification = {
          key: Date.now(),
          username: formData.username,
          title: formData.title,
          content: formData.content,
          type: formData.type,
        };
        setNotifications(showNotification);

        alert("Thông báo đã được gửi thành công!");
        resetFormData();
        setIsModalVisible(false);
      });
    } catch (error) {
      console.error("Error while sending notification:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      username: "",
      title: "",
      content: "",
      type: "ALERT",
    });
  };

  const showDetailModal = (record) => {
    Modal.info({
      title: `Details of Notification to ${record.user.username}`,
      content: (
        <div>
          <p>
            <strong>Title:</strong> {record.notification.title}
          </p>
          <p>
            <strong>Content:</strong> {record.notification.content}
          </p>
          <p>
            <strong>Type:</strong> {record.notification.type}
          </p>
        </div>
      ),
    });
  };

  const confirmDeleteNotification = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn chắc chắn xóa thông báo của ${record.user.username} này chứ?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        deleteNotification(record.key);
      },
    });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.notification.id !== id)
    );
    alert("Thông báo đã được xóa thành công!");
  };

  const filteredNotifications =
    filterType === "ALL"
      ? notifications
      : notifications.filter(
          (notification) => notification.notification.type === filterType
        );

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4 bg-slate-200 rounded-md mb-4 items-center">
        <p className="text-2xl font-bold">Notification</p>
        <div className="flex items-center">
          <Select
            placeholder="Select type"
            style={{ width: 150, marginRight: 20 }}
            value={filterType}
            onChange={(value) => setFilterType(value)}
          >
            <Select.Option value="ALL">All</Select.Option>
            <Select.Option value="ALERT">Alert</Select.Option>
            <Select.Option value="Error">Error</Select.Option>
          </Select>
          <Button
            type="primary"
            onClick={showModal}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Send Notification
          </Button>
        </div>
      </div>

      <Modal
        title="Send Notification"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="send" type="primary" onClick={sendNotification}>
            Send
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Username" required>
            <Input
              placeholder="Enter Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Title" required>
            <Input
              placeholder="Enter Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Content" required>
            <TextArea
              rows={4}
              placeholder="Enter Content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Type">
            <Select
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
            >
              <Select.Option value="ALERT">Alert</Select.Option>
              <Select.Option value="Error">Error</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNotifications.map((notification) => (
            <tr key={notification.key}>
              <td className="border border-gray-300 px-4 py-2">
                {notification.user.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {notification.notification.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {notification.notification.type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {notification.notification.content}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Space size="middle">
                  <Button
                    type="link"
                    onClick={() => showDetailModal(notification)}
                  >
                    Detail
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => confirmDeleteNotification(notification)}
                  >
                    Delete
                  </Button>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={filteredNotifications.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminSender;
