import {useSelector, useDispatch} from "react-redux";
import { increment, decrement, setValue } from "./store";
import { Button, Typography, InputNumber, Space, message } from "antd";
import { useEffect } from "react";

const { Title } = Typography;

function Counter(){
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if (count !== 0 && count % 10 === 0) {
            message.success(`Count reached ${count}!`);
        }
    }, [count]);

    return (
        <Space direction="vertical" size="large" style={{ marginTop: 50 }}>
            <Title level={2}>Global Counter : {count}</Title>
        
            <Space>
                <Button type="primary" onClick={() => dispatch(increment())}>
                    Increment
                </Button>

                <Button danger onClick={() => dispatch(decrement())}>
                    Decrement
                </Button>
            </Space>
            
            <InputNumber 
                min={0} 
                placeholder="Set Value" 
                onChange={(value) => dispatch(setValue(value))}
            />
        </Space>
    ); 
}

export default Counter;
