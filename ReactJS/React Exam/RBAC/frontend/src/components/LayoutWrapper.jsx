import React, { useState } from "react";
import { Layout, Menu, Button, Space, Popconfirm, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined, TeamOutlined, SafetyOutlined, ProjectOutlined, IdcardOutlined, DashboardOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import useSyncPermissions from "../hooks/userSyncPermission";
const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

// Sidebar menu items based on permissions from database
const getMenuItems = (permissions) => {
  const items = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" }
  ];

  // Check permissions for each module
  const usersPerms = permissions?.users || [];
  const employeesPerms = permissions?.employees || [];
  const projectsPerms = permissions?.projects || [];
  const rolesPerms = permissions?.roles || [];

  // Add Users menu if has any permission
  if (usersPerms.length > 0) {
    items.push({ key: "/users", icon: <IdcardOutlined />, label: "Users" });
  }

  // Add Employees menu if has any permission
  if (employeesPerms.length > 0) {
    items.push({ key: "/employees", icon: <TeamOutlined />, label: "Employees" });
  }

  // Add Projects menu if has any permission
  if (projectsPerms.length > 0) {
    items.push({ key: "/projects", icon: <ProjectOutlined />, label: "Projects" });
  }

  // Add Roles menu if has any permission
  if (rolesPerms.length > 0) {
    items.push({ key: "/roles", icon: <SafetyOutlined />, label: "Roles" });
  }

  return items;
};

const LayoutWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useSyncPermissions();  
  const menuItems = getMenuItems(user?.permissions);

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const currentYear = new Date().getFullYear();

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider  
      className="!bg-[#001529] fixed left-0 top-0 h-screen z-50 shadow-xl transition-all duration-300"
        collapsible 
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        >
        
        <div className="h-16 flex item-center justify-center borderd-b border-white/10">
          <Text className={`!text-white !text-2xl py-3 font-bold ${
          collapsed ? "text-base" : "text-lg"
        }`}>
            {collapsed ? "RB" : "RBAC System"}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="!bg-[#001529] border-r-0"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="min-h-screen flex flex-col">
        <Header className="flex justify-between item-center !bg-white px-6 shadow-md !sticky top-0 z-[99] h-16">
          <Text  className="!text-2xl font-bold py-3 text-[#001529]">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/users" && "Users Management"}
            {location.pathname === "/employees" && "Employees Management"}
            {location.pathname === "/projects" && "Projects Management"}
            {location.pathname === "/roles" && "Roles & Permissions"}
          </Text>
          <Space>
            <UserOutlined  className="mr-2 text-base"/>
            <Text className="mr-2 font-semibold">{user?.user_name}</Text>
            <Text className="mr-4 px-2 py-0.5 bg-gray-100 rounded text-gray-500">
              {user?.roleName}
            </Text>
            <Popconfirm
              title="Logout"
              description="Are you sure you want to logout?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />}
              >
                Logout
              </Button>
            </Popconfirm>
          </Space>
        </Header>
        <Content className="m-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <Outlet />
          </div>
        </Content>
        <Footer className="bg-white border-t !p-3 text-center py-3 text-xs text-gray-500">
          <Space split={<span className="text-gray-400">|</span>}>
            <Text type="secondary">RBAC System ©{currentYear}</Text>
            <Text type="secondary">All Rights Reserved</Text>
            <Text type="secondary">Version 1.0.0</Text>
          </Space>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
