import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slice/authSlice";
import { loginUser } from "../services/authService";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setError("");
    try {
     
      const userData = await loginUser(values.email, values.password);
      dispatch(setUser(userData));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">
      <Card className="w-[420px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <Space direction="vertical" className="w-full text-center" size={4}>
          <Title level={2} className="!m-0">
            RBAC System
          </Title>
          <Text type="secondary">Role-Based Access Control System</Text>
        </Space>

        <div className="mt-6">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Form layout="vertical" onFinish={handleLogin} size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-[45px] rounded-lg"
            >
              Login
            </Button>
          </Form>
          
        </div>
      </Card>
    </div>
  );
};

export default Login;
