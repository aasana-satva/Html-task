// frontend/src/Pages/Employees.jsx
// Employees management - HR can do full CRUD

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Popconfirm,
  message,
  Alert,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title } = Typography;
const BASE_URL = "http://localhost:3001";

const Employees = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const perms = currentUser?.permissions?.employees || [];

  const canView = perms.includes("view");
  const canAdd = perms.includes("add");
  const canEdit = perms.includes("edit");
  const canDelete = perms.includes("delete");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [form] = Form.useForm();

  // Search, sort states
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadData = async () => {
    setLoading(true);
    try {
      const empRes = await fetch(`${BASE_URL}/employees`);
      setEmployees(await empRes.json());
    } catch {
      message.error("Failed to load employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingEmp(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingEmp(record);
    form.setFieldsValue({
      employee_name: record.employee_name,
      employee_email: record.employee_email,
      designation: record.designation,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingEmp) {
        await fetch(`${BASE_URL}/employees/${editingEmp.employee_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingEmp, ...values }),
        });
        message.success("Employee updated!");
      } else {
        await fetch(`${BASE_URL}/employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: Date.now(), ...values }),
        });
        message.success("Employee added!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      if (err.errorFields) return;
      message.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/employees/${id}`, { method: "DELETE" });
      message.success("Employee deleted!");
      loadData();
    } catch {
      message.error("Failed to delete employee");
    }
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...employees];

    // Search by name only
    if (searchText) {
      data = data.filter(emp =>
        emp.employee_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by ID only
    data.sort((a, b) => {
      const aVal = Number(a.employee_id);
      const bVal = Number(b.employee_id);
      if (aVal < bVal) return sortOrder === "ascend" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "ascend" ? 1 : -1;
      return 0;
    });

    return data;
  }, [employees, searchText, sortOrder]);

  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
  }, [searchText]);

  const columns = [
    {
      title: "ID",
      dataIndex: "employee_id",
      key: "employee_id",
      sorter: true,
      sortOrder: sortOrder,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Email",
      dataIndex: "employee_email",
      key: "employee_email",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              Edit
            </Button>
          )}
          {canDelete && (
             <Popconfirm
    title="Delete this employee?"
    description="Are you sure you want to delete this employee?"
    onConfirm={() => handleDelete(record.id)}  
    okText="Yes"
    cancelText="No"
  >
    <Button icon={<DeleteOutlined />} size="small" danger>
      Delete
    </Button>
  </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination((p) => ({ ...p, current: pagination.current || 1 }));
    if (sorter.field === "employee_id") {
      setSortOrder(sorter.order || "ascend");
    }
  };

  if (!canView) {
    return <Alert message="You don't have permission to view employees." type="error" />;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Title level={2} className="!m-0">Employees Management</Title>
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
              Add Employee
            </Button>
          )}
        </Space>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="employee_id"
        loading={loading}
        bordered
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: 5,
          total: filteredData.length,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={editingEmp ? "Edit Employee" : "Add Employee"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="employee_name"
            label="Full Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="employee_email"
            label="Email"
            rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item 
            name="designation" 
            label="Designation" 
            rules={[{ required: true, message: "Designation is required" }]}
          >
            <Input placeholder="Enter designation" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
