
import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle="You don't have permission to access this page."
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/dashboard", { replace: true })}  
          >
            Go to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
