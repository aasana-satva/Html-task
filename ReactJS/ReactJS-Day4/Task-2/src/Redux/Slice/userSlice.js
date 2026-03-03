import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    users :[
        { id: 1, name: "Aasana", email: "aasana@gmail.com", role: "Admin" },
        { id: 2, name: "Rahul", email: "rahul@gmail.com", role: "User" },
        { id: 3, name: "Priya", email: "priya@gmail.com", role: "Manager" },
        { id: 4, name: "Kiran", email: "kiran@gmail.com", role: "User" },
        { id: 5, name: "Neha", email: "neha@gmail.com", role: "HR" },
        { id: 6, name: "Rohan", email: "rohan@gmail.com", role: "MANAGER" },
        { id: 7, name: "Tanya", email: "tanya@gmail.com", role: "HR" } ,
        { id: 8, name: "Jenish", email: "jenish@gmail.com", role: "user" }
    ],
};

const userSlice =createSlice({
    name :"user",
    initialState, 
    reducers:{
        deleteUser:(state,action)=>{
            state.users = state.users.filter(
                (user) =>user.id !==action.payload
            );
        },
    },
});

export default userSlice.reducer;
export const {deleteUser} =userSlice.actions;