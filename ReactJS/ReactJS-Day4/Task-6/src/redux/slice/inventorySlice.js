import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    products:[
          { id: 1, name: "Laptop", price: 1000 },
        { id: 2, name: "Phone", price: 600 },
        { id: 3, name: "Headphones", price: 150 },
        { id: 4, name: "Laptop", price: 1000 },
        { id: 5, name: "Phone", price: 600 },
        { id: 6, name: "Headphones", price: 150 },
    ],
};

const inventortSlice =createSlice({
    name:"inventory",
    initialState,
    reducers :{
        deleteProduct :(state,action) =>{
            state.products=state.products.filter(
                (product)=>product.id !==action.payload
            );
        },
    },
});

export const {deleteProduct} =inventortSlice.actions;
export default inventortSlice.reducer;