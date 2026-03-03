// frontend/src/Pages/Projects.jsx
// Projects management - Manager has full CRUD, others can only view

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

const Projects = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const perms = currentUser?.permissions?.projects || [];

  const canView = perms.includes("view");
  const canAdd = perms.includes("add");
  const canEdit = perms.includes("edit");
  const canDelete = perms.includes("delete");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // Search, filter, sort states
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [sortField, setSortField] = useState("project_id");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadData = async () => {
    setLoading(true);
    try {
      const projRes = await fetch(`${BASE_URL}/projects`);
      setProjects(await projRes.json());
    } catch {
      message.error("Failed to load projects");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({
      project_name:        record.project_name,
      project_description: record.project_description,
      tech_stack:          record.tech_stack,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingProject) {
        await fetch(`${BASE_URL}/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingProject, ...values }),
        });
        message.success("Project updated!");
      } else {
        await fetch(`${BASE_URL}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id: Date.now(), ...values }),
        });
        message.success("Project added!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      if (err.errorFields) return;
      message.error("Failed to save project");
    }
  };


const handleDelete = async (id) => {
  try {
    await fetch(`${BASE_URL}/projects/${id}`, { method: "DELETE" });
    message.success("Project deleted!");
    await loadData();
  } catch {
    message.error("Failed to delete project");
  }
};

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...projects];

    // Search by project name only
    if (searchText) {
      data = data.filter(project =>
        project.project_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by ID only - ascending and descending
    if (sortField && sortOrder) {
      data.sort((a, b) => {
        const aVal = Number(a[sortField]);
        const bVal = Number(b[sortField]);
        if (aVal < bVal) return sortOrder === "ascend" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "ascend" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [projects, searchText, sortField, sortOrder]);

  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
  }, [searchText]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "project_id",
      sorter: (a, b) => Number(a.project_id) - Number(b.project_id),
      sortOrder: sortField === "project_id" ? sortOrder : null,
      width: 80,
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Description",
      dataIndex: "project_description",
      key: "project_description",
      render: (text) => text || "-",
    },
    {
      title: "Tech Stack",
      dataIndex: "tech_stack",
      key: "tech_stack",
      render: (text) => text || "-",
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
  title="Delete this project?"
  description="Are you sure you want to delete this project?"
  onConfirm={() => handleDelete(record.id)}  // ✅ record.id not record.project_id
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
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order || "ascend");
    }
  };

  if (!canView) {
    return <Alert message="You don't have permission to view projects." type="error" />;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Title level={2} className="!m-0">
          Projects Management
        </Title>
        <Space wrap>
          <Input
            placeholder="Search by project name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[220px]"
            allowClear
          />
          {canAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Project
            </Button>
          )}
        </Space>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="project_id"
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
        title={editingProject ? "Edit Project" : "Add New Project"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="project_name"
            label="Project Name"
            rules={[{ required: true, message: "Project name is required" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item
            name="project_description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter project description" rows={3} />
          </Form.Item>
          <Form.Item
            name="tech_stack"
            label="Tech Stack"
          >
            <Input placeholder="Enter tech stack (e.g., React, Node.js, MongoDB)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
