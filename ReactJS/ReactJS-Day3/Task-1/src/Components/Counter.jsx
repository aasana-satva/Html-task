import { useReducer, useState} from "react";
import "./Counter.css";

const initialState={count: 0, history:[]};

function reducer(state,action){
    switch(action.type){

        case "INCREMENT":
            return{
                count : state.count + 1,
                history :[...state.history , state.count]
            };

        case "DECREMENT" :
             return{
                count : state.count - 1,
                history :[...state.history , state.count]
            };

        case "RESET":
            return{
                count : 0,
                history :[...state.history , state.count]
            };

        case "SET_VALUE":
            if(isNaN(action.payload)){
                return state;
            }

            return{
                count :action.payload,
                history :[...state.history , state.count]
            };
            

        default:
            return state;
    }
}

function Counter() {
    const [state,dispatch] = useReducer (reducer,initialState);
    const [inputValue,setInputValues] =useState("");

    return(
        <div className="counter-container">
            <h2>Complex Counter</h2>

            <h1> {state.count}</h1>

            <div className="button-group">
                <button onClick={()=>dispatch({type:"INCREMENT"})}>
                    Increment
                </button>

                <button onClick={()=>dispatch({type:"DECREMENT"})}>
                    Decrement
                </button>

                <button onClick={()=>dispatch({type:"RESET"})}>
                    Reset
                </button>
            </div>

            <div className="set-value">
                <input 
                type="number"
                placeholder="Enter Value"
                value={inputValue}
                onChange={(e)=>setInputValues(e.target.value)}  />          
                
                <button onClick={()=> dispatch ({
                    type:"SET_VALUE",
                    payload: Number(inputValue)
                })}>
                    Set Value
                </button>
            </div>

            <div className="history">
                <h3>History</h3>

                <ul>
                    {state.history.map((value,index)=>(
                        <li key={index}>{value}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Counter;