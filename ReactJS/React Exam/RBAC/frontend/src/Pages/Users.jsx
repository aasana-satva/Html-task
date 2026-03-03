import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table, Button, Modal, Form, Input, Select,
  Space, Tag, Typography, Popconfirm, message, Alert,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import bcrypt from "bcryptjs";

const { Title } = Typography;
const BASE_URL = "http://localhost:3001";

const roleColors = { Admin: "red", HR: "blue", Supervisor: "orange", Manager: "green" };

const Users = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const perms = currentUser?.permissions?.users || [];

  const canView   = perms.includes("view");
  const canAdd    = perms.includes("add");
  const canEdit   = perms.includes("edit");
  const canDelete = perms.includes("delete");
  
  // Check if current user is Admin
  const isCurrentUserAdmin = currentUser?.roleName === "Admin";

  const [users, setUsers]             = useState([]);
  const [roles, setRoles]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText]   = useState("");
  const [pagination, setPagination]   = useState({ current: 1, pageSize: 10 });
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${BASE_URL}/users`),
        fetch(`${BASE_URL}/roles`),
      ]);
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      const merged = usersData.map((u) => ({
        ...u,
        roleName: rolesData.find((r) => r.role_id === u.role_id)?.role || "Unknown",
      }));
      setUsers(merged);
      setRoles(rolesData);
    } catch {
      message.error("Failed to load data");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView, loadData]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      user_name: record.user_name,
      role_id:   record.role_id,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    try {
      if (editingUser) {
        const updated = {
          ...editingUser,
          user_name: values.user_name,
          role_id:   values.role_id,
        };
        await fetch(`${BASE_URL}/users/${editingUser.user_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        message.success("User updated!");
      } else {
        // Fetch existing users to get the max user_id
        const usersRes = await fetch(`${BASE_URL}/users`);
        const usersData = await usersRes.json();
        
        // Calculate the next user_id
        const maxUserId = usersData.reduce((max, user) => 
          (user.user_id > max ? user.user_id : max), 0);
        const newUserId = maxUserId + 1;
        
        // Hash password with bcryptjs before storing
        const hashedPassword = await bcrypt.hash(values.password, 10);
        
        // Include both user_id and id (for json-server compatibility)
        const newUser = {
          user_name: values.user_name,
          email:     values.email,
          password:  hashedPassword,
          role_id:   values.role_id,
          user_id:   newUserId,
          id:        newUserId,
        };
        await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        message.success("User added!");
      }
      setModalOpen(false);
      form.resetFields();
      await loadData();
    } catch {
      message.error("Failed to save user");
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await fetch(`${BASE_URL}/users/${user_id}`, { method: "DELETE" });
      message.success("User deleted!");
      await loadData();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchText) return users;
    return users.filter((u) =>
      u.user_name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
  }, [searchText]);

  const roleFilters = useMemo(() =>
    roles.map((r) => ({ text: r.role, value: r.role })),
  [roles]);

  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 80,
      sorter: (a, b) => Number(a.user_id) - Number(b.user_id),
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "user_name",
      key: "user_name",
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      filters: roleFilters,
      filterMode: "menu",
      filterSearch: true,
      onFilter: (value, record) => record.roleName === value,
      render: (role) => <Tag color={roleColors[role] || "default"}>{role}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isSelf = record.user_id === currentUser.user_id;
        const isRecordAdmin = record.roleName === "Admin";
        
        // Disable edit/delete for Admin users when another Admin is logged in
        const isAdminEditingAnotherAdmin = isCurrentUserAdmin && isRecordAdmin;
        
        return (
          <Space>
            {canEdit && !isSelf && !isAdminEditingAnotherAdmin && (
              <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                Edit
              </Button>
            )}
            {canDelete && !isSelf && !isAdminEditingAnotherAdmin && (
              <Popconfirm
                title="Delete this user?"
                description="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(record.user_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} size="small" danger>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  if (!canView) {
    return <Alert message="You don't have permission to view users." type="error" />;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Title level={2} className="!m-0">Users Management</Title>
        <Space wrap>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[200px]"
            allowClear
          />
          {canAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add User
            </Button>
          )}
        </Space>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        bordered
        onChange={(pager) => setPagination((p) => ({ ...p, current: pager.current || 1 }))}
        pagination={{
          current: pagination.current,
          pageSize: 5,
          total: filteredData.length,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText="Save"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="user_name"
            label="Full Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((r) => (
                <Select.Option key={r.role_id} value={r.role_id}>
                  {r.role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {!editingUser && (
            <>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
