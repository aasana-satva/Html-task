import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers=createAsyncThunk(
    "users/fetchUsers",
    async(_,{rejectWithValue})=>{
        try{
            const response =await axios.get(        
                "https://jsonplaceholder.typicode.com/users"
            );
            return response.data;
        } catch(error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice =createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default userSlice.reducer;