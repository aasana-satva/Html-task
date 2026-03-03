import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
    "movies/fetchMovies",
    async(searchTerm)=>{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${searchTerm}`);
        const data = await response.json();
        return data;
    }
);

const movieSlice = createSlice({
    name:"movies",
    initialState:{
        movies:[],     
        loading:false,
        error:null,
        successMessage: null,
    },
    reducers:{},
    extraReducers:(builder)=> {
        builder
        .addCase(fetchMovies.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
       .addCase(fetchMovies.fulfilled,(state,action)=>{
            state.loading = false;
            state.movies = action.payload;
            state.successMessage = "Data fetched successfully!";

        })
        .addCase(fetchMovies.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default movieSlice.reducer;
