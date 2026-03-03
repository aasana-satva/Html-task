import { Card, Typography } from "antd";
import InventoryTable  from "../Components/InventoreTable";
const {Title} =Typography;

function InventoryPage(){
    return(
         <div style={{ padding: 40 }}>
      <Card>
        <Title level={3}>Smart Inventory Table</Title>
        <InventoryTable />
      </Card>
    </div>
    );
}

export default InventoryPage;