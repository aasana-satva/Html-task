import { Form, Input, Button, Card, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Slice/authSlice";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USERS } from "../userdata";

function Login() {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isRehydrated, setIsRehydrated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsRehydrated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isRehydrated && isAuthenticated && user) {
            const redirectPath = user.role === "admin" ? "/dashboard" : "/user-dashboard";
            navigate(redirectPath, { replace: true });
        }
    }, [isRehydrated, isAuthenticated, user, navigate]);

    const onFinish =(values) =>{
        const foundUser = USERS.find(
            u => u.name === values.name && u.password === values.password
        );

        if (!foundUser) {
            message.error("Invalid username or password");
            return;
        }

        dispatch(
            login({
                name: foundUser.name,
                role: foundUser.role,
            })
        );
        
        setTimeout(() => {
            const redirectPath = foundUser.role === "admin" ? "/dashboard" : "/user-dashboard";
            navigate(redirectPath, { replace: true });
        }, 50);
    };

    if (!isRehydrated) {
        return null;
    }

    if (isAuthenticated && user) {
        const redirectPath = user.role === "admin" ? "/dashboard" : "/user-dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return (
    <Card style={{ width: 300, margin: "100px auto" }}>
      <Form onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </Card>
  );
}

export default Login;
