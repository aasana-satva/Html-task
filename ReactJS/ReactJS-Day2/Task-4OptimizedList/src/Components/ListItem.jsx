import React from "react";
import "./ListItem.css";

const ListItem =React.memo (({item,onDelete})=> {
    console.log("Rendering",item.name);

    return (
    <li className="list-item">
        <span>{item.name}</span>
        <button onClick={()=>onDelete(item.id)}>Delete</button>
    </li>
);
});

export default ListItem;

