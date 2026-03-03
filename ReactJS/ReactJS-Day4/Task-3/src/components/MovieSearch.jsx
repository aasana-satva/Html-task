
import React,{useEffect} from "react";
import {Input, Spin, Row, Col, Card,Alert} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { fetchMovies } from "../redux/slice/movieSlice";

const {Search} =Input;

const MovieSearch =() =>{
    const dispatch = useDispatch();
    const {movies, loading,error,successMessage } = useSelector((state)=> state.movies);

    useEffect(()=>{
        dispatch(fetchMovies(""));
    },[dispatch]);
    //dispact take the action ->go to reducer 
    //state.movies
    //state.movies.movies
    //state.movies.loading
    const onSearch =(value)=>{
        dispatch(fetchMovies(value));
    };

    return (
        <div style={{padding:"20px"}}>
            <Search 
                placeholder="Search Movies.."
                enterButton
                size="large"
                onSearch={onSearch}
            />

 {successMessage && (
  <Alert
    // message="Success"
    description="Post data fetched successfully!"
    type="success"
    // showIcon
    closable
    style={{ marginTop: "15px" }}
  />
)}


            
                
            {error && (
    <Alert 
        message={error} 
        type="error" 
        description="Failed to load data"
        showIcon 
        style={{ marginTop: "15px" }}
    />
)}
            {loading &&(
                <div style={{textAlign:"center",marginTop:"20px"}}>
                    <Spin size="large" />
                </div>
            )}

            <Row gutter={[16,16]} style={{marginTop:"20px"}}>
                {movies.map((movie)=>(
                    <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                        <Card title={movie.title} variant>
                            {movie.body}
                        </Card>
                    </Col>         
                ))}
            </Row>
        </div>
    );
};

export default MovieSearch;
