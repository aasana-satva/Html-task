import { deleteUser } from "../Slice/userSlice";

export const removeUser =(id) =>(dispatch)=>{
    dispatch(deleteUser(id));
};