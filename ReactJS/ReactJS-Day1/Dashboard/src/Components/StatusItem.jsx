function StatusItem({data}){
    const textColor= data.status.trim().toLowerCase()=="online"? "green" :"orange"

    return (
        <div className="status-card">
            <p> <strong>Id: {data.id} </strong></p> 
             <h3>{data.name}</h3>
            <p style={{color: textColor}}>
                {data.status}
            </p>
        </div>
    );
}

export default StatusItem;