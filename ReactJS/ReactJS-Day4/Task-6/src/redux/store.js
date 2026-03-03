import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./slice/inventorySlice";

export const store= configureStore({
    reducer :{
        inventory:inventoryReducer,
    },
});