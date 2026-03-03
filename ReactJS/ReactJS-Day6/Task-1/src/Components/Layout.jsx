import { Layout, Button, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider} = Layout;

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRehydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const items = [];
    
    // Add Dashboard based on role
    if (user?.role === "admin") {
      items.push({
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        onClick: () => navigate("/dashboard"),
      });

    }
    return items;
  };

  const getDashboardTitle = () => {
    if (user?.role === "admin") {
      return "Admin Dashboard";
    }
    return "User Dashboard";
  };

  if (!isRehydrated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
          My App
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: "bold" }}>
            {getDashboardTitle()}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>
              {user?.name} ({user?.role})
            </span>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "16px", padding: "24px", background: "#fff", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
