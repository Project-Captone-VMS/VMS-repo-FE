import React, { useState } from "react";
import { Space, Table, Select, Modal, Input, Button, AutoComplete } from "antd";

const { Column } = Table;

const initialData = [
  {
    key: "1",
    user: "hoàng lanh",
    firstName: "John",
    lastName: "Brown",
    email: "hlanh.20082k3@gmail.com",
    type: "notification",
    content: "Thông báo nhận tiền thưởng",
    title: "nhận lương",
    createdAt: new Date().toLocaleString(),
  },
  {
    key: "2",
    user: "Kim Tuyền",
    firstName: "Jim",
    lastName: "Green",
    email: "thanhvu.20082k3@gmail.com",
    type: "notification",
    content: "Thông báo nhận 8.am có cuộc họp",
    title: "meeting",
    createdAt: new Date().toLocaleString(),
  },
  {
    key: "3",
    user: "Thanh Vũ",
    firstName: "Lanh",
    lastName: "Lee",
    email: "doremon.20082k3@gmail.com",
    type: "error",
    content: " đã vi phạm",
    title: "vi phạm",
    createdAt: new Date().toLocaleString(),
  },
];

export default function IndexNotification() {
  const [data, setData] = useState(initialData);
  const [filterType, setFilterType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);

  const [formData, setFormData] = useState({
    to: "",
    title: "",
    type: "",
    content: "",
  });

  const filteredData = filterType
    ? data.filter((item) => item.type === filterType)
    : data;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const uniqueUsers = [
    ...new Set(data.map((item) => item.user).filter((user) => user !== "")),
  ];

  const options = [
    { value: "@all", label: "Send to all" },
    ...uniqueUsers.map((user) => ({
      value: `@${user}`,
      label: user,
    })),
  ];

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setFormData({ to: "", title: "", type: "", content: "" });
  };

  const handleSendNotification = () => {
    if (formData.to && formData.title && formData.type && formData.content) {
      let newNotifications = [];
      if (formData.to === "@all") {
        newNotifications = data.map((item) => ({
          key: String(data.length + 1 + Math.random()),
          firstName: item.firstName,
          lastName: item.lastName,
          user: item.user,
          email: item.email,
          type: formData.type,
          title: formData.title,
          content: formData.content,
          createdAt: new Date().toLocaleString(),
        }));
      } else {
        const selectedUser = data.find(
          (item) => `@${item.user}` === formData.to
        );
        if (selectedUser) {
          newNotifications.push({
            key: String(data.length + 1),
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            user: selectedUser.user,
            email: selectedUser.email,
            type: formData.type,
            title: formData.title,
            content: formData.content,
            createdAt: new Date().toLocaleString(),
          });
        }
      }
      setData([...data, ...newNotifications]);
      handleCloseModal();
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteNotification = () => {
    setData(data.filter((item) => item.key !== selectedRecord.key));
    setDeleteModalVisible(false);
  };

  const showDetailModal = (record) => {
    setDetailRecord(record);
    setFormData((prev) => ({
      ...prev,
      to: `@${record.user}`, // Gán user được click
    }));
    setDetailModalVisible(true);
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4 bg-slate-200 rounded-md mb-4 items-center">
        <p className="text-2xl font-bold">Notification</p>
        <div>
          <Select
            placeholder="Select type"
            style={{ width: 150, marginRight: 20, height: 45 }}
            options={[
              { value: "", label: "All" },
              { value: "notification", label: "Notification" },
              { value: "error", label: "Error" },
            ]}
            onChange={(value) => setFilterType(value)}
          />
          <button
            onClick={showModal}
            className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Send Notification
          </button>
        </div>
      </div>
      <Table
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      >
        {/* <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" /> */}
        <Column title="User" dataIndex="user" key="user" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Type" dataIndex="type" key="type" />
        <Column title="Content" dataIndex="content" key="content" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <a onClick={() => showDetailModal(record)}>Detail</a>
              <a onClick={() => showDeleteModal(record)}>Delete</a>
            </Space>
          )}
        />
      </Table>

      <Modal
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        style={{
          position: "fixed",
          bottom: "5%",
          right: "30%",
          margin: 0,
          width: 400,
        }}
        bodyStyle={{
          padding: "20px",
          borderRadius: "10px",
        }}
        closable={false}
      >
        <h3 className="text-lg font-bold mb-4">Send Notification</h3>
        <div className="flex flex-col gap-4">
          <AutoComplete
            options={options}
            placeholder="Type @ to see suggestions"
            className="w-full"
            onChange={(value) => setFormData({ ...formData, to: value })}
            value={formData.to}
          />
          <Input
            placeholder="Enter title"
            className="w-full"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            placeholder="Select type"
            style={{ width: "100%" }}
            options={[
              { value: "notification", label: "Notification" },
              { value: "error", label: "Error" },
            ]}
            onChange={(value) => setFormData({ ...formData, type: value })}
            value={formData.type}
          />
          <textarea
            placeholder="Enter content"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            value={formData.content}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="default"
            onClick={handleCloseModal}
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleSendNotification}>
            Send
          </Button>
        </div>
      </Modal>

      <Modal
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleDeleteNotification}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa notification này không?</p>
      </Modal>

      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {detailRecord && (
          <div>
            <h3 className="text-lg font-bold mb-4">Notification Details</h3>
            <div className="mb-4">
              <p>
                <b>First Name:</b> {detailRecord.firstName}
              </p>
              <p>
                <b>Last Name:</b> {detailRecord.lastName}
              </p>
              <p>
                <b>Email:</b> {detailRecord.email}
              </p>
              <p>
                <b>Title:</b> {detailRecord.title}
              </p>
              <p>
                <b>Type:</b> {detailRecord.type}
              </p>
              <p>
                <b>Content:</b> {detailRecord.content}
              </p>
              <p>
                <b>Created At:</b> {detailRecord.createdAt}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Send New Notification</h3>
              <div>
                <AutoComplete
                  options={options}
                  placeholder="Type @ to see suggestions"
                  className="w-full mb-2"
                  onChange={(value) => setFormData({ ...formData, to: value })}
                  value={formData.to}
                />
                <Input
                  placeholder="Enter title"
                  className="w-full mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  value={formData.title}
                />
                <Select
                  placeholder="Select type"
                  className="w-full mb-2"
                  options={[
                    { value: "notification", label: "Notification" },
                    { value: "error", label: "Error" },
                  ]}
                  onChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  value={formData.type}
                />
                <textarea
                  placeholder="Enter content"
                  rows={4}
                  className="w-full mb-2 border border-gray-300 rounded-md p-2"
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  value={formData.content}
                />
              </div>
              <Button
                type="primary"
                onClick={handleSendNotification}
                style={{ float: "right" }}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
