import {Table, Button , Popconfirm  , message} from "antd";
import {useSelector,useDispatch} from "react-redux";
import { deleteUser } from "../Redux/Slice/userSlice";
import { removeUser } from "../Redux/Action/userAction";

function UserTable(){
    const users = useSelector((state)=>state.users.users);
    const dispatch = useDispatch();

    const handleDelete =(id) =>{
        dispatch(removeUser(id));
        message.success("User deleted successfully!");
    };

    const columns =[
        {
            title:"ID",
            dataIndex:"id",
            key:"id",
            sorter :(a,b)=>a.id-b.id,
        },
        {
            title:"Name",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"Email",
            dataIndex:"email",
            key:"email"
        },
        {
            title:"Role",
            dataIndex:"role",
            key:"role",
            filters:[
                {text:"Admin",value:"Admin"},
                {text:"User",value:"User"},
                {text:"Manager",value:"Manager"},
                { text: "HR", value: "HR" },
            ],

            onFilter:(value,record) =>record.role.trim().toLowerCase()===value.trim().toLowerCase(),
        },

        {
            title:"Action",
            key:"action",
            align:'center',
            render:(_,record)=>(
                <Popconfirm  
                    title="Are you sure?"
                    onConfirm={()=>handleDelete(record.id)}
                    onText="Yes"
                    cancelText="No"
                >

                <Button danger>Delete</Button>
                </Popconfirm >
            ),
        },
    ];

    return (
    <Table 
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{pageSize:3}}
        bordered
    />
    );
}

export default UserTable;