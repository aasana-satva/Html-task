import { Layout, Menu, Button } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { toggleSidebar } from "../features/layout/layoutSlice";

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.theme.darkMode);
  const collapsed = useSelector((state) => state.layout.collapsed);

  const themeBg = darkMode ? "#141414" : "#fff";
  const themeText = darkMode ? "#fff" : "#000";
  const headerBg = darkMode ? "#1f1f1f" : "#1890ff";

  return (
    <Layout style={{ minHeight: "100vh", background: themeBg }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => dispatch(toggleSidebar())}
        theme={darkMode ? "dark" : "light"}
        style={{ marginTop: "64px" }}
      >
        <div style={{ 
          height: "64px", 
          marginTop: "-64px",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: darkMode ? "#fff" : "#000"
        }}>
          My Admin Panel
        </div>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          onClick={(e) => navigate(e.key)}
          items={[
            { key: "/", label: "Dashboard" },
            { key: "/users", label: "Users" },
            { key: "/settings", label: "Settings" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          background: headerBg,
          borderBottom: `1px solid ${darkMode ? '#303030' : '#d9d9d9'}`
        }}>
          <div></div>
          <Button onClick={() => dispatch(toggleTheme())}>
            Toggle Theme
          </Button>
        </Header>

        <Content style={{ 
          padding: "20px",
          background: themeBg,
          color: themeText,
          minHeight: "calc(100vh - 64px)"
        }}>
          <div style={{ color: themeText }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
