import {useRef,useEffect} from "react";
import "./App.css";
function Memopad(){

    const textareaRef =useRef(null);

    const saveCount =useRef(0);

    useEffect(()=> {
        textareaRef.current.focus();

    },[]);

    const handleSave =() =>{
       saveCount.current +=1;
       console.log("Saved Times:" ,saveCount.current);
    };

    return(
        <div className="memo-container">
            <h1> Memopad </h1>
            <textarea   className="memo-textarea"  defaultValue="" ref={textareaRef} /> 
            <br />
            <button onClick={handleSave}  className="save-btn">Manual Save</button>
        </div>
    );

    }

    export default Memopad;