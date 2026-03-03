import {useState, useCallback,useEffect} from "react";
import ListItem from "./Components/ListItem";
import "./Dashboard.css";

function Dashboard(){

  console.log("Dashboard re-render")
const [item,setItem] =useState([
        {id:1, name:"ABC"},
        {id:2, name:"XYS"},
        {id:3, name:"XAT"}
]);

const[time,setTime] =useState (new Date());
useEffect(()=>{
    const interval=setInterval(()=>{
        setTime(new Date());
    },1000);

    return()=>clearInterval(interval);
},[]);

const handleDelete =useCallback((id)=>{
    setItem((prev)=>prev.filter((item)=>item.id!==id));
},[]);

return (
    <div className="dashboard">
      <h1>Optimized List</h1>
      <h3 className="time">Current Time: {time.toLocaleTimeString()}</h3>

<ul className="list-container">
        {item.map((item) => (
          <ListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;