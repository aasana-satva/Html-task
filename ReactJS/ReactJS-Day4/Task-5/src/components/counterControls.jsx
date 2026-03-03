import { useSelector, useDispatch } from "react-redux";
import { Button, Space, Statistic, Switch } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  LockOutlined,
} from "@ant-design/icons";

import {
  increment,
  decrement,
  reset,
  toggleLock,
} from "../redux/slice/counterSlice";

function CounterControls() {
  const dispatch = useDispatch();
  const { value, locked } = useSelector((state) => state.counter);

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Statistic title="Counter Value" value={value} />

      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => dispatch(increment())}
          disabled={locked}
        >
          Increment
        </Button>

        <Button
          danger
          icon={<MinusOutlined />}
          onClick={() => dispatch(decrement())}
          disabled={locked}
        >
          Decrement
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => dispatch(reset())}
        >
          Reset
        </Button>
      </Space>

      <Space>
        <LockOutlined />
        <Switch
          checked={locked}
          onChange={() => dispatch(toggleLock())}
        />
        Lock Counter
      </Space>
    </Space>
  );
}

export default CounterControls;