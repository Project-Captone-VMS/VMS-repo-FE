import React, { useState, useMemo, useEffect } from "react";
import { Modal, Input, Select, Button, Form, Space, Pagination } from "antd";
import { over } from "stompjs";
import { getAllNoti } from "../../services/apiRequest";
import useGetAllNotice from "../../components/hooks/useGetAllNotice";
import SockJS from "sockjs-client";
import * as Yup from "yup";

const { TextArea } = Input;
const ITEMS_PER_PAGE = 10;

const formSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  type: Yup.string().required("Type is required"),
});

const AdminSender = () => {
  const { notice, setNotice } = useGetAllNotice();
  const [errors, setErrors] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    title: "",
    content: "",
    type: "ALERT",
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormData();
  };

  const sendNotification = async () => {
    try {
      await formSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const socket = new SockJS("http://localhost:8080/ws");
      const stompClient = over(socket);

      stompClient.connect({}, async () => {
        const res = await stompClient.send(
          `/app/chat/${formData.username}`,
          {},
          JSON.stringify(formData),
        );

        resetFormData();
        setIsModalVisible(false);
      });
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      const updateNoti = await getAllNoti();
      setNotice(updateNoti);
    };

    fetchNotices();
  }, []);

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
    setErrors({});
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
    setNotice((prev) =>
      prev.filter((notification) => notification.notification.id !== id),
    );
    alert("Thông báo đã được xóa thành công!");
  };

  const filteredNotifications = useMemo(() => {
    return filterType === "ALL"
      ? notice
      : notice.filter(
          (notification) => notification.notification.type === filterType,
        );
  }, [notice, filterType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredNotifications.slice(start, end);
  }, [filteredNotifications, currentPage]);

  return (
    <div >
      <div className=" top-0 z-50 mb-4 flex w-full items-center justify-between rounded-md bg-slate-200 px-2 py-4">
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
          <Form.Item
            label="Username"
            validateStatus={errors.username ? "error" : ""}
            help={errors.username}
          >
            <Input
              placeholder="Enter Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Title"
            validateStatus={errors.title ? "error" : ""}
            help={errors.title}
          >
            <Input
              placeholder="Enter Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Content"
            validateStatus={errors.content ? "error" : ""}
            help={errors.content}
          >
            <TextArea
              rows={4}
              placeholder="Enter Content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Type"
            validateStatus={errors.type ? "error" : ""}
            help={errors.type}
          >
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
            <tr key={notification.key} className="text-center">
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
      <Pagination
        current={currentPage}
        pageSize={ITEMS_PER_PAGE}
        total={filteredNotifications.length}
        onChange={handlePageChange}
        className="sticky bottom-0 mr-0 mt-4 flex justify-end bg-white py-2"
      />
    </div>
  );
};

export default AdminSender;
