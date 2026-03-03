// frontend/src/Pages/Dashboard.jsx

import React from "react";
import { Card, Row, Col, Typography, Tag, Avatar, Divider } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  SafetyOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const roleConfig = {
  Admin:      { color: "red",    icon: <CrownOutlined /> },
  HR:         { color: "blue",   icon: <TeamOutlined /> },
  Supervisor: { color: "orange", icon: <SafetyOutlined /> },
  Manager:    { color: "green",  icon: <ProjectOutlined /> },
};

const moduleIcons = {
  users:     <UserOutlined />,
  employees: <TeamOutlined />,
  projects:  <ProjectOutlined />,
  roles:     <SafetyOutlined />,
};

const permColors = {
  view: "blue", add: "green", edit: "orange", delete: "red",
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const config = roleConfig[user?.roleName] || roleConfig.Admin;
  const permissions = user?.permissions || {};

  return (
    <div>
      {/* Welcome Card */}
      <Card className="rounded-xl mb-6 shadow-sm">
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar
              size={56}
              icon={<UserOutlined />}
              className="bg-[#1677ff]"
            />
          </Col>
          <Col>
            <Text type="secondary">Welcome back 👋</Text>
            <Title level={3} className="!m-0 !mt-1 !mb-2">
              {user?.user_name}
            </Title>
            <div className="flex flex-wrap gap-2">
            <Tag icon={config.icon} color={config.color}>
              {user?.roleName}
            </Tag>
            <Tag>{user?.email}</Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Permissions */}
      <Title level={5} className="!mb-6 !mt-4">Your Permissions</Title>
      <Row gutter={[12, 12]}>
        {Object.entries(permissions).map(([module, perms]) => (
          <Col xs={24} sm={12} lg={6} key={module}>
            <Card size="small" className="rounded-lg shadow-sm">
              <div className="flex item-center gap-2 mb-3">
                <Avatar size={28} icon={moduleIcons[module]} className="!bg-[#1677ff]" />
                <Text strong className="capitalize">{module}</Text>
              </div>
              <Divider className="!mt-0 !mb-3" />
              {perms.length === 0 ? (
                <Tag color="default">No Access</Tag>
              ) : (
                <div className="flex flex-wrap gap-1">
                {perms.map((p) => (
                  <Tag key={p} color={permColors[p]} >{p}</Tag>
                ))} 
                 </div>
              )} 
             
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
