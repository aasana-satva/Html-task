import {useState, useEffect } from "react";
import "./SmartCunter.css"

function SmartCounter(){
    const[count,setCount] =useState(0);
    const[isActive,setIsActive]=useState(false);

    useEffect(()=>{
        let interval=null;

        if(isActive){
            interval =setInterval(()=>{
                setCount((prevCount)=>prevCount+1);
            },1000)
        }

        return()=>{
            clearInterval(interval);
        };
    });

    const toggleCounter= () =>{
        setIsActive(!isActive);
    };
    const resetCounter =() =>{
        setCount(0);
        setIsActive(false);
    };

    return(
        <div className="counter-container">
            <h1> Smart Counter</h1>
            <h2 className="count">{count}</h2>

            <div className="buttons">
            <button onClick={toggleCounter} className="start-btn">
                {isActive?"Pause":"Start"}
            </button>

            <button onClick={resetCounter} className="reset-btn" >
                Reset
            </button>
            </div>
        </div>
    );
}

export default SmartCounter;