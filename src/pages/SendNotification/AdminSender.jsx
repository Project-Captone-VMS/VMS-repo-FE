import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Form, Table, Space } from "antd";
import { over } from "stompjs";
import SockJS from "sockjs-client";

const { TextArea } = Input;

const AdminSender = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    title: "",
    content: "",
    type: "ALERT",
  });
  const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo đã gửi
  const [filterType, setFilterType] = useState("ALL"); // Loại thông báo để lọc

  // Lấy dữ liệu từ localStorage khi trang load lại
  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  // Lưu danh sách thông báo vào localStorage khi nó thay đổi
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Hiển thị modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormData();
  };

  // Gửi thông báo
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

        // Lưu thông báo vào bảng
        const newNotification = {
          key: Date.now(), // Dùng để tạo giá trị unique
          username: formData.username,
          title: formData.title,
          content: formData.content,
          type: formData.type,
        };
        setNotifications((prev) => [...prev, newNotification]);

        alert("Thông báo đã được gửi thành công!");
        resetFormData();
        setIsModalVisible(false);
      });
    } catch (error) {
      console.error("Error while sending notification:", error);
    }
  };

  // Cập nhật giá trị trong form
  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  // Reset dữ liệu form
  const resetFormData = () => {
    setFormData({
      username: "",
      title: "",
      content: "",
      type: "ALERT",
    });
  };

  // Hiển thị chi tiết thông báo
  const showDetailModal = (record) => {
    Modal.info({
      title: `Details of Notification to ${record.username}`,
      content: (
        <div>
          <p>
            <strong>Title:</strong> {record.title}
          </p>
          <p>
            <strong>Content:</strong> {record.content}
          </p>
          <p>
            <strong>Type:</strong> {record.type}
          </p>
        </div>
      ),
    });
  };

  // Xác nhận xóa thông báo
  const confirmDeleteNotification = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn chắc chắn xóa thông báo của ${record.username} này chứ?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        deleteNotification(record.key);
      },
    });
  };

  // Xóa thông báo
  const deleteNotification = (key) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.key !== key)
    );
    alert("Thông báo đã được xóa thành công!");
  };

  // Dữ liệu sau khi lọc
  const filteredNotifications =
    filterType === "ALL"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === filterType
        );

  return (
    <div>
      {/* Nút mở Modal và Select Filter */}
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
            <Select.Option value="SYSTEM">System</Select.Option>
            <Select.Option value="USER">User</Select.Option>
            <Select.Option value="ALERT">Alert</Select.Option>
            <Select.Option value="REMINDER">Reminder</Select.Option>
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

      {/* Modal */}
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
          {/* Username */}
          <Form.Item label="Username" required>
            <Input
              placeholder="Enter Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </Form.Item>

          {/* Title */}
          <Form.Item label="Title" required>
            <Input
              placeholder="Enter Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </Form.Item>

          {/* Content */}
          <Form.Item label="Content" required>
            <TextArea
              rows={4}
              placeholder="Enter Content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
          </Form.Item>

          {/* Type */}
          <Form.Item label="Type">
            <Select
              value={formData.type}
              onChange={(value) => handleInputChange("type", value)}
            >
              <Select.Option value="SYSTEM">System</Select.Option>
              <Select.Option value="USER">User</Select.Option>
              <Select.Option value="ALERT">Alert</Select.Option>
              <Select.Option value="REMINDER">Reminder</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng hiển thị thông báo */}
      <Table
        dataSource={filteredNotifications}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      >
        <Table.Column title="Username" dataIndex="username" key="username" />
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column title="Type" dataIndex="type" key="type" />
        <Table.Column title="Content" dataIndex="content" key="content" />
        <Table.Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button type="link" onClick={() => showDetailModal(record)}>
                Detail
              </Button>
              <Button
                type="link"
                danger
                onClick={() => confirmDeleteNotification(record)}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default AdminSender;
