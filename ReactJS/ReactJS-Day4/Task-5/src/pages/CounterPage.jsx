import { Card, Typography } from "antd";
import CounterControls from "../components/counterControls";
const {Title} =Typography;

function CounterPage() {
    return(
         <div
      style={{
        padding: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
        <Card style={{width: 400, textAlign: "center"}}>
            <Title level={3}>Themed Global Counter</Title>
            <CounterControls />
        </Card>
    </div>
    );
}

export default CounterPage;