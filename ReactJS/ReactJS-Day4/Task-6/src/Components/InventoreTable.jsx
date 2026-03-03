import { Table, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct } from "../redux/slice/inventorySlice";

function InventoryTable() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.inventory.products);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product Deleted Successfully");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter :(a,b)=>a.id-b.id
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 3 ,}}
    />
  );
}

export default InventoryTable;