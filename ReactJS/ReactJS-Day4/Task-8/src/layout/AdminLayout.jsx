import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/slice/uiSlice";

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const collapsed = useSelector((state) => state.ui.collapsed);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          // defaultSelectedKeys={["/"]}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "/settings",
              icon: <SettingOutlined />,
              label: <Link to="/settings">Settings</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <div style={{ padding: "10px" }}>
          <Button
            type="primary"
            onClick={() => dispatch(toggleSidebar())}
          > Toggle menu </Button>
        </div>

        <Content style={{ margin: "20px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;