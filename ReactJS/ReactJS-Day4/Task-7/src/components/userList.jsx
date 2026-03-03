import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slice/userSlice";
import { List, Card, Spin, Alert } from "antd";

function UserList (){
    const dispatch =useDispatch();

    const{users,loading,error} =useSelector ((state)=>state.users);

    useEffect(()=>{
        dispatch(fetchUsers());
    },[dispatch]);

    if(loading){
        return <Spin size="large" />;
    }

    if(error){
        return (<Alert  
        message="Error"
        description={error}
        type="error"
        showIcon />
        );
    }

    return (
        <List 
           grid ={{  gutter: 16, column: 3}}
           dataSource={users}
           renderItem={(user)=>(
            <List.Item>
                 <Card title={user.name}>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Website: {user.website}</p>
          </Card>
            </List.Item>
           )}
        />
    );
}

export default UserList;